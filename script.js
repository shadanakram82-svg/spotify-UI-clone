const addButton = document.querySelector(".left-add-btn");
const addButtonIcon = addButton?.querySelector(".left-add-icon");
const createMenu = document.querySelector(".library-create-menu");
const createMenuOptions = document.querySelectorAll(".library-create-option");

const topSearchForm = document.querySelector(".top-search-form");
const topSearchInput = document.querySelector(".top-search-input");
const topSearchPanel = document.querySelector(".top-search-panel");
const topSearchItems = Array.from(document.querySelectorAll(".top-search-item"));
const topSearchEmpty = document.querySelector(".top-search-empty");

const leftRecents = document.querySelector(".left-recents");
const searchButton = document.querySelector(".left-search-btn");
const searchInput = document.querySelector(".left-library-search-input");
const sortButton = document.querySelector(".left-sort-btn");
const sortLabel = document.querySelector(".left-sort-label");
const sortMenu = document.querySelector(".library-sort-menu");
const sortOptions = Array.from(document.querySelectorAll(".library-sort-option"));
const viewOptions = Array.from(document.querySelectorAll(".library-view-option"));

const libraryList = document.querySelector(".left-library-list");
const libraryItems = libraryList ? Array.from(libraryList.querySelectorAll(".library-item")) : [];

const sortLabels = {
  recents: "Recents",
  "recently-added": "Recently Added",
  alphabetical: "Alphabetical",
  creator: "Creator",
};

let currentSort = "recently-added";
let currentView = libraryList?.dataset.view || "list";

const closeTopSearch = () => {
  if (!topSearchForm || !topSearchPanel) {
    return;
  }

  topSearchForm.classList.remove("is-open");
  topSearchPanel.setAttribute("aria-hidden", "true");
};

const openTopSearch = () => {
  if (!topSearchForm || !topSearchPanel) {
    return;
  }

  closeCreateMenu();
  closeSortMenu();
  topSearchForm.classList.add("is-open");
  topSearchPanel.setAttribute("aria-hidden", "false");
};

const filterTopSearchItems = () => {
  if (!topSearchInput || topSearchItems.length === 0) {
    return;
  }

  const query = topSearchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  topSearchItems.forEach((item) => {
    const searchText = item.textContent.toLowerCase();
    const isVisible = query === "" || searchText.includes(query);
    item.hidden = !isVisible;

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (topSearchEmpty) {
    topSearchEmpty.hidden = visibleCount !== 0;
  }
};

const closeCreateMenu = () => {
  if (!addButton || !createMenu) {
    return;
  }

  addButton.classList.remove("is-active");
  addButton.setAttribute("aria-expanded", "false");

  if (addButtonIcon) {
    addButtonIcon.classList.remove("fa-xmark");
    addButtonIcon.classList.add("fa-plus");
  }

  createMenu.classList.remove("is-open");
  createMenu.setAttribute("aria-hidden", "true");
};

const openCreateMenu = () => {
  if (!addButton || !createMenu) {
    return;
  }

  addButton.classList.add("is-active");
  addButton.setAttribute("aria-expanded", "true");

  if (addButtonIcon) {
    addButtonIcon.classList.remove("fa-plus");
    addButtonIcon.classList.add("fa-xmark");
  }

  createMenu.classList.add("is-open");
  createMenu.setAttribute("aria-hidden", "false");
};

const closeSortMenu = () => {
  if (!sortButton || !sortMenu) {
    return;
  }

  sortButton.setAttribute("aria-expanded", "false");
  sortMenu.classList.remove("is-open");
  sortMenu.setAttribute("aria-hidden", "true");
};

const openSortMenu = () => {
  if (!sortButton || !sortMenu) {
    return;
  }

  sortButton.setAttribute("aria-expanded", "true");
  sortMenu.classList.add("is-open");
  sortMenu.setAttribute("aria-hidden", "false");
};

const openSearch = () => {
  if (!leftRecents || !searchButton || !searchInput) {
    return;
  }

  leftRecents.classList.add("is-searching");
  searchButton.setAttribute("aria-expanded", "true");
  requestAnimationFrame(() => searchInput.focus());
};

const closeSearch = ({ clear = false } = {}) => {
  if (!leftRecents || !searchButton || !searchInput) {
    return;
  }

  if (clear) {
    searchInput.value = "";
  }

  leftRecents.classList.remove("is-searching");
  searchButton.setAttribute("aria-expanded", "false");
};

const sortItems = () => {
  if (!libraryList || libraryItems.length === 0) {
    return;
  }

  const sortedItems = [...libraryItems].sort((itemA, itemB) => {
    if (currentSort === "alphabetical") {
      return itemA.dataset.title.localeCompare(itemB.dataset.title);
    }

    if (currentSort === "creator") {
      return itemA.dataset.creator.localeCompare(itemB.dataset.creator);
    }

    if (currentSort === "recents") {
      return Number(itemA.dataset.recent) - Number(itemB.dataset.recent);
    }

    return Number(itemB.dataset.added) - Number(itemA.dataset.added);
  });

  sortedItems.forEach((item) => {
    libraryList.appendChild(item);
  });
};

const filterItems = () => {
  if (!searchInput || libraryItems.length === 0) {
    return;
  }

  const query = searchInput.value.trim().toLowerCase();

  libraryItems.forEach((item) => {
    const searchText = [
      item.dataset.title,
      item.dataset.meta,
      item.dataset.creator,
    ]
      .join(" ")
      .toLowerCase();

    item.hidden = query !== "" && !searchText.includes(query);
  });
};

const setSort = (sortValue) => {
  currentSort = sortValue;

  if (sortLabel) {
    sortLabel.textContent = sortLabels[sortValue];
  }

  sortOptions.forEach((option) => {
    const isSelected = option.dataset.sort === sortValue;
    option.classList.toggle("is-selected", isSelected);
  });

  sortItems();
  filterItems();
};

const setView = (viewValue) => {
  if (!libraryList) {
    return;
  }

  currentView = viewValue;
  libraryList.dataset.view = viewValue;

  viewOptions.forEach((option) => {
    const isSelected = option.dataset.view === viewValue;
    option.classList.toggle("is-selected", isSelected);
  });
};

if (addButton && createMenu) {
  addButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = createMenu.classList.contains("is-open");
    closeSortMenu();

    if (isOpen) {
      closeCreateMenu();
      return;
    }

    openCreateMenu();
  });

  createMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  createMenuOptions.forEach((option) => {
    option.addEventListener("click", () => {
      closeCreateMenu();
    });
  });
}

if (topSearchForm && topSearchInput && topSearchPanel) {
  topSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  topSearchForm.addEventListener("click", (event) => {
    event.stopPropagation();
    openTopSearch();
  });

  topSearchInput.addEventListener("focus", () => {
    openTopSearch();
  });

  topSearchInput.addEventListener("input", () => {
    openTopSearch();
    filterTopSearchItems();
  });

  topSearchPanel.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  topSearchItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.stopPropagation();
      topSearchInput.value = item.dataset.value || "";
      filterTopSearchItems();
      closeTopSearch();
    });
  });
}

if (searchButton && searchInput && leftRecents) {
  searchButton.addEventListener("click", (event) => {
    event.stopPropagation();
    openSearch();
  });

  searchInput.addEventListener("input", () => {
    filterItems();
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (searchInput.value.trim() !== "") {
        searchInput.value = "";
        filterItems();
        return;
      }

      closeSearch();
    }
  });
}

if (sortButton && sortMenu) {
  sortButton.addEventListener("click", (event) => {
    event.stopPropagation();
    closeCreateMenu();
    const isOpen = sortMenu.classList.contains("is-open");

    if (isOpen) {
      closeSortMenu();
      return;
    }

    openSortMenu();
  });

  sortMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });
}

sortOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setSort(option.dataset.sort);
  });
});

viewOptions.forEach((option) => {
  option.addEventListener("click", () => {
    setView(option.dataset.view);
  });
});

document.addEventListener("click", (event) => {
  if (topSearchForm && topSearchPanel) {
    if (!topSearchForm.contains(event.target)) {
      closeTopSearch();
    }
  }

  if (createMenu && addButton) {
    if (!createMenu.contains(event.target) && !addButton.contains(event.target)) {
      closeCreateMenu();
    }
  }

  if (sortMenu && sortButton) {
    if (!sortMenu.contains(event.target) && !sortButton.contains(event.target)) {
      closeSortMenu();
    }
  }

  if (leftRecents && searchInput) {
    const clickedInsideSearch = leftRecents.contains(event.target);

    if (!clickedInsideSearch && searchInput.value.trim() === "") {
      closeSearch();
    }
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeTopSearch();
    closeCreateMenu();
    closeSortMenu();
  }
});

filterTopSearchItems();
setSort(currentSort);
setView(currentView);
filterItems();

// ── Right-bar content filter (All / Music / Podcast) ──────────────────────
const rightFilterBtns = Array.from(document.querySelectorAll('.right-up-box .right-text'));
const rightSections = Array.from(document.querySelectorAll('.right-bar [data-section]'));

const applyRightFilter = (filter) => {
  // update button active state
  rightFilterBtns.forEach((btn) => {
    btn.classList.toggle('right-text-active', btn.dataset.filter === filter);
  });

  // show / hide sections
  rightSections.forEach((section) => {
    if (filter === 'all') {
      section.classList.remove('section-hidden');
    } else {
      // show section if its data-section matches the chosen filter
      const matches = section.dataset.section === filter;
      section.classList.toggle('section-hidden', !matches);
    }
  });
};

rightFilterBtns.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    applyRightFilter(btn.dataset.filter);
  });
});

// initialise with the button that already has the active class
const initialActive = rightFilterBtns.find((b) => b.classList.contains('right-text-active'));
if (initialActive) applyRightFilter(initialActive.dataset.filter);

// ── Navigation between Main Content, Liked Songs and Premium ──────
const navHomeBtn = document.querySelector('.nav-home-link');
const navLogoBtn = document.querySelector('.nav-logo');
const navExploreBtn = document.querySelector('.nav-explore');
const likedNavTriggers = document.querySelectorAll('[data-navigate="liked-songs"]');
const rightBarHome = document.querySelector('.right-bar');
const rightPlayListView = document.getElementById('liked-playlist-view');
const premiumView = document.getElementById('premium-view');

const navigateHome = (e) => {
  if (e) e.preventDefault();
  if (rightBarHome && rightPlayListView && premiumView) {
    rightBarHome.classList.remove('section-hidden');
    rightPlayListView.classList.add('section-hidden');
    premiumView.classList.add('section-hidden');
  }
};

const navigateLikedSongs = (e) => {
  if (e) e.preventDefault();
  if (rightBarHome && rightPlayListView && premiumView) {
    rightBarHome.classList.add('section-hidden');
    rightPlayListView.classList.remove('section-hidden');
    premiumView.classList.add('section-hidden');
  }
};

const navigatePremium = (e) => {
  if (e) e.preventDefault();
  if (rightBarHome && rightPlayListView && premiumView) {
    rightBarHome.classList.add('section-hidden');
    rightPlayListView.classList.add('section-hidden');
    premiumView.classList.remove('section-hidden');
  }
};

if (navHomeBtn) {
  navHomeBtn.addEventListener('click', navigateHome);
}
if (navLogoBtn) {
  navLogoBtn.addEventListener('click', navigateHome);
}
if (navExploreBtn) {
  navExploreBtn.addEventListener('click', navigatePremium);
}

likedNavTriggers.forEach(trigger => {
  trigger.addEventListener('click', navigateLikedSongs);
});

// ── Audio Playback Logic ─────────────────
const mainAudio = document.getElementById('main-audio-player');
const masterPlayBtn = document.getElementById('master-play-btn');
const playableTracks = document.querySelectorAll('.playable-track');
const bigPlaylistPlayBtns = document.querySelectorAll('.playlist-play-main'); // The big green button

if (mainAudio && masterPlayBtn) {
  let isPlaying = false;

  const updateAudioUI = () => {
    const isPaused = mainAudio.paused;

    // 1. Update Master Play button at the bottom
    const masterIcon = masterPlayBtn.querySelector('i');
    if (masterIcon) {
      masterIcon.className = isPaused ? "fa-solid fa-play" : "fa-solid fa-pause";
    }

    // 2. Update big green play buttons
    bigPlaylistPlayBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        icon.className = isPaused ? "fa-solid fa-play" : "fa-solid fa-pause";
      }
    });

    // 3. Update all individual track rows
    playableTracks.forEach(t => {
      const icon = t.querySelector('.track-play');
      if (!icon) return;

      if (t.getAttribute('data-audio-src') === mainAudio.src) {
        // This is the active track
        icon.className = isPaused ? "fa-solid fa-play track-play" : "fa-solid fa-pause track-play";
        // Force the icon to show constantly if playing
        icon.style.display = isPaused ? "" : "inline-block";
        const trackNum = t.querySelector('.track-num');
        if (trackNum) trackNum.style.display = isPaused ? "" : "none";
      } else {
        // Inactive tracks
        icon.className = "fa-solid fa-play track-play";
        icon.style.display = ""; // revert to CSS hover logic
        const trackNum = t.querySelector('.track-num');
        if (trackNum) trackNum.style.display = "";
      }
    });
  };

  mainAudio.addEventListener('play', updateAudioUI);
  mainAudio.addEventListener('pause', updateAudioUI);
  mainAudio.addEventListener('ended', () => {
    // When song ends, put everything back to standard play state
    updateAudioUI();
  });

  const togglePlay = () => {
    if (mainAudio.src && mainAudio.src !== window.location.href) {
      if (mainAudio.paused) {
        mainAudio.play();
      } else {
        mainAudio.pause();
      }
    } else {
      alert("No song selected! Click a track row to load a song.");
    }
  };

  masterPlayBtn.addEventListener('click', togglePlay);

  // Wire up the big green playlist play button to just play the first track if none playing, or toggle
  bigPlaylistPlayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!mainAudio.src || mainAudio.src === window.location.href) {
        // If nothing is loaded, play the first track by simulating a click
        if (playableTracks.length > 0) {
          playableTracks[0].click();
        }
      } else {
        togglePlay();
      }
    });
  });

  // When clicking a track row or its specific play button
  playableTracks.forEach(track => {
    track.addEventListener('click', () => {
      const audioUrl = track.getAttribute('data-audio-src');
      if (audioUrl) {
        if (mainAudio.src !== audioUrl) {
          // Changed song!
          mainAudio.src = audioUrl;
          mainAudio.play();
        } else {
          // Same song clicked, so just toggle play/pause
          togglePlay();
        }

        // Visually highlight this row
        document.querySelectorAll('.playlist-track-row').forEach(t => t.style.background = "transparent");
        track.style.background = "rgba(255,255,255,0.1)";

        // Sync track info to the bottom player
        const titleElem = track.querySelector('.track-name');
        const artistElem = track.querySelector('.track-artist');
        const imgElem = track.querySelector('.track-title-col img');

        const songData = {
          src: audioUrl,
          title: titleElem ? titleElem.textContent : "Unknown",
          artist: artistElem ? artistElem.textContent : "Unknown",
          imgSrc: imgElem ? imgElem.src : ""
        };

        if (titleElem) document.getElementById('player-song-title').textContent = songData.title;
        if (artistElem) document.getElementById('player-song-artist').textContent = songData.artist;

        const mainImgElem = document.getElementById('player-album-art');
        const mainVerifiedElem = document.getElementById('player-verified');

        if (imgElem && mainImgElem) {
          mainImgElem.src = songData.imgSrc;
          mainImgElem.style.opacity = '1';
        }
        if (mainVerifiedElem) {
          mainVerifiedElem.style.opacity = '1';
        }

        // Save to cache so it survives refreshes
        localStorage.setItem('spotifyLastSong', JSON.stringify(songData));
      }
    });
  });

  // ── Sync Progress Bar ─────────────────
  const progressBar = document.getElementById('progress-bar');
  const currentTimeElem = document.getElementById('current-time');
  const totalTimeElem = document.getElementById('total-time');

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (progressBar && currentTimeElem && totalTimeElem) {
    const updateProgressGradient = (percent) => {
      progressBar.style.background = `linear-gradient(90deg, #ffffff ${percent}%, #444 ${percent}%)`;
    };

    mainAudio.addEventListener('timeupdate', () => {
      if (mainAudio.duration) {
        const progressPercent = (mainAudio.currentTime / mainAudio.duration) * 100;
        progressBar.value = progressPercent;
        updateProgressGradient(progressPercent);
        currentTimeElem.textContent = formatTime(mainAudio.currentTime);
        totalTimeElem.textContent = formatTime(mainAudio.duration);
      }
    });

    progressBar.addEventListener('input', () => {
      if (mainAudio.duration) {
        const seekTime = (progressBar.value / 100) * mainAudio.duration;
        mainAudio.currentTime = seekTime;
        updateProgressGradient(progressBar.value);
      }
    });

    mainAudio.addEventListener('loadedmetadata', () => {
      totalTimeElem.textContent = formatTime(mainAudio.duration);
      progressBar.value = 0;
      updateProgressGradient(0);
    });
  }

  // ── Load Last Played Song from LocalStorage ──
  try {
    const lastSongStr = localStorage.getItem('spotifyLastSong');
    if (lastSongStr) {
      const lastSong = JSON.parse(lastSongStr);
      if (lastSong.src) {
        mainAudio.src = lastSong.src; // Loads the file but does NOT play it
        document.getElementById('player-song-title').textContent = lastSong.title;
        document.getElementById('player-song-artist').textContent = lastSong.artist;
        const imgElem = document.getElementById('player-album-art');
        const verifiedElem = document.getElementById('player-verified');

        if (lastSong.imgSrc) {
          imgElem.src = lastSong.imgSrc;
          imgElem.style.opacity = '1';
        }
        if (verifiedElem) {
          verifiedElem.style.opacity = '1';
        }
      }
    }
  } catch (e) {
    console.error("Could not load last song data", e);
  }
}

// ── Address Edit (Checkout Page) ─────────────────────────────────────
(function () {
  const addressBox = document.getElementById('addressBox');
  const addressDisplay = document.getElementById('addressDisplay');
  const addressEditForm = document.getElementById('addressEditForm');
  const addressEditBtn = document.getElementById('addressEditBtn');
  const addressSaveBtn = document.getElementById('addressSaveBtn');
  const addressCancelBtn = document.getElementById('addressCancelBtn');
  const stateSelect = document.getElementById('stateSelect');
  const citySelect = document.getElementById('citySelect');
  const addressCityEl = document.getElementById('addressCity');
  const addressStateEl = document.getElementById('addressState');

  if (!addressBox || !addressDisplay || !addressEditForm) return;

  // City data for each state
  const cityData = {
    'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kakinada', 'Kadapa', 'Anantapur', 'Eluru', 'Ongole', 'Vizianagaram'],
    'Arunachal Pradesh': ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Along', 'Tezu'],
    'Assam': ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Karimganj', 'Sivasagar'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chapra', 'Sasaram'],
    'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur'],
    'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Saket', 'Lajpat Nagar', 'Karol Bagh', 'Connaught Place', 'Janakpuri', 'Pitampura', 'Vasant Kunj', 'Shahdara', 'Narela'],
    'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Quepem'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Morbi', 'Nadiad', 'Mehsana', 'Bharuch', 'Porbandar'],
    'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Yamunanagar', 'Kurukshetra', 'Rewari', 'Palwal'],
    'Himachal Pradesh': ['Shimla', 'Manali', 'Dharamshala', 'Solan', 'Mandi', 'Kullu', 'Bilaspur', 'Chamba', 'Hamirpur', 'Palampur'],
    'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar', 'Giridih', 'Ramgarh', 'Dumka'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi', 'Kalaburagi', 'Davangere', 'Ballari', 'Vijayapura', 'Shivamogga', 'Tumakuru', 'Udupi', 'Hassan'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram', 'Kasaragod'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Singrauli', 'Burhanpur', 'Khandwa'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Navi Mumbai', 'Sangli', 'Latur', 'Akola', 'Jalgaon', 'Ahmednagar'],
    'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul', 'Kakching'],
    'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara'],
    'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai'],
    'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Baripada', 'Bhadrak', 'Jharsuguda'],
    'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Moga', 'Barnala', 'Phagwara', 'Muktsar', 'Kapurthala', 'Firozpur'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Bikaner', 'Ajmer', 'Bhilwara', 'Alwar', 'Sikar', 'Pali', 'Sri Ganganagar', 'Bharatpur', 'Tonk', 'Kishangarh', 'Beawar'],
    'Sikkim': ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Dindigul', 'Tiruppur', 'Kanchipuram', 'Nagercoil'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Siddipet', 'Suryapet'],
    'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailashahar', 'Belonia', 'Ambassa'],
    'Uttar Pradesh': ['Lucknow', 'Noida', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Gorakhpur', 'Saharanpur', 'Jhansi', 'Firozabad', 'Mathura', 'Ayodhya', 'Muzaffarnagar'],
    'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Nainital', 'Mussoorie', 'Pithoragarh'],
    'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantiniketan', 'Haldia', 'Raiganj']
  };

  // Populate city dropdown based on selected state
  const populateCities = (state) => {
    citySelect.innerHTML = '<option value="">— Select City —</option>';
    const cities = cityData[state];
    if (cities) {
      cities.forEach(city => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    }
  };

  // When state changes, refresh city list
  stateSelect.addEventListener('change', () => {
    populateCities(stateSelect.value);
  });

  // Open edit form
  addressEditBtn.addEventListener('click', () => {
    addressDisplay.style.display = 'none';
    addressEditForm.style.display = 'block';
    addressBox.classList.add('editing');

    // Pre-select current state & populate cities
    const currentState = addressStateEl.textContent.trim();
    stateSelect.value = currentState;
    populateCities(currentState);

    // Pre-select current city
    const currentCity = addressCityEl.textContent.trim();
    if (citySelect.querySelector(`option[value="${currentCity}"]`)) {
      citySelect.value = currentCity;
    }
  });

  // Save
  addressSaveBtn.addEventListener('click', () => {
    const newState = stateSelect.value;
    const newCity = citySelect.value;

    if (!newState) {
      stateSelect.focus();
      return;
    }
    if (!newCity) {
      citySelect.focus();
      return;
    }

    addressStateEl.textContent = newState;
    addressCityEl.textContent = newCity;

    addressEditForm.style.display = 'none';
    addressDisplay.style.display = 'flex';
    addressBox.classList.remove('editing');
  });

  // Cancel
  addressCancelBtn.addEventListener('click', () => {
    addressEditForm.style.display = 'none';
    addressDisplay.style.display = 'flex';
    addressBox.classList.remove('editing');
  });
})();

// ── Plan / Checkout / QR Payment Logic ──────────────────────────────────────
(function () {
  // Plan data
  var planData = {
    'lite':     { name: 'Premium Lite',     sub: '1 Lite account',               price: '&#8377;139.00' },
    'standard': { name: 'Premium Standard', sub: '1 Standard account',           price: '&#8377;199.00' },
    'platinum': { name: 'Premium Platinum', sub: 'Up to 3 Platinum accounts',    price: '&#8377;299.00' },
    'student':  { name: 'Premium Student',  sub: '1 verified Standard account',  price: '&#8377;99.00'  }
  };

  // Plan buttons -> redirect overlay -> checkout page
  document.querySelectorAll('.plan-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();

      var text = btn.textContent.toLowerCase();
      var key = 'standard';
      if (text.includes('lite'))     key = 'lite';
      if (text.includes('platinum')) key = 'platinum';
      if (text.includes('student'))  key = 'student';

      var overlay = document.getElementById('redirectOverlay');
      if (overlay) overlay.classList.add('active');

      setTimeout(function () {
        if (overlay) overlay.classList.remove('active');
        var data = planData[key];
        document.getElementById('checkoutPlanName').textContent  = data.name;
        document.getElementById('checkoutPlanSub').textContent   = data.sub;
        document.getElementById('checkoutPlanPrice').textContent = data.price;

        // Update summary section
        document.getElementById('summaryPlanNameBottom').textContent  = data.name;
        document.getElementById('summaryPlanPriceBottom').textContent = data.price + '/month';
        document.getElementById('summaryTotalPriceBottom').textContent = data.price;

        document.getElementById('checkoutPage').classList.add('active');
      }, 2500);
    });
  });

  // Change plan -> go back
  var changePlanBtn = document.getElementById('checkoutChangePlan');
  if (changePlanBtn) {
    changePlanBtn.addEventListener('click', function (e) {
      e.preventDefault();
      document.getElementById('checkoutPage').classList.remove('active');
    });
  }

  // View all plans scroll
  var viewAllPlansBtn = document.querySelector('.btn-all-plans');
  var premiumBottom   = document.querySelector('.premium-bottom');
  if (viewAllPlansBtn && premiumBottom) {
    viewAllPlansBtn.addEventListener('click', function (e) {
      e.preventDefault();
      premiumBottom.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // QR Payment Page logic
  var qrTimerInterval = null;

  function startQrCountdown(seconds) {
    clearInterval(qrTimerInterval);
    var remaining   = seconds;
    var countdownEl = document.getElementById('qrCountdown');

    function tick() {
      var mins = Math.floor(remaining / 60);
      var secs = remaining % 60;
      countdownEl.textContent =
        String(mins).padStart(2, '0') + ':' + String(secs).padStart(2, '0');
      if (remaining <= 0) { clearInterval(qrTimerInterval); return; }
      remaining--;
    }

    tick();
    qrTimerInterval = setInterval(tick, 1000);
  }

  var completePurchaseBtn = document.getElementById('completePurchaseBtn');
  if (completePurchaseBtn) {
    completePurchaseBtn.addEventListener('click', function () {
      var summarySection = document.querySelector('.checkout-summary-section');
      var btn = document.getElementById('completePurchaseBtn');

      // Enter loading state
      if (summarySection) summarySection.classList.add('purchase-loading');
      btn.classList.add('loading');
      btn.disabled = true;

      // After 2.2 s show QR page and reset loading state
      setTimeout(function () {
        if (summarySection) summarySection.classList.remove('purchase-loading');
        btn.classList.remove('loading');
        btn.disabled = false;
        document.getElementById('qrPage').classList.add('active');
        startQrCountdown(299);
      }, 2200);
    });
  }

  var qrBackBtn = document.getElementById('qrBackBtn');
  if (qrBackBtn) {
    qrBackBtn.addEventListener('click', function () {
      document.getElementById('qrPage').classList.remove('active');
      clearInterval(qrTimerInterval);
      document.getElementById('qrCountdown').textContent = '04:59';
    });
  }
})();

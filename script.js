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

// ── Checkout Page Logic ──────────────────────────────────────────────────────
// This script handles: redirect overlay, plan data from URL, address editing,
// checkout summary, QR payment flow, and countdown timer.

(function () {
  // Plan data
  var planData = {
    'lite':     { name: 'Premium Lite',     sub: '1 Lite account',              price: '\u20B9139.00' },
    'standard': { name: 'Premium Standard', sub: '1 Standard account',          price: '\u20B9199.00' },
    'platinum': { name: 'Premium Platinum', sub: 'Up to 3 Platinum accounts',   price: '\u20B9299.00' },
    'student':  { name: 'Premium Student',  sub: '1 verified Standard account', price: '\u20B999.00'  }
  };

  // ── Read plan from URL query string ──
  var params = new URLSearchParams(window.location.search);
  var planKey = params.get('plan') || 'standard';
  var data = planData[planKey] || planData['standard'];

  // ── Show redirect overlay on load, then fade after 2.5s ──
  var overlay = document.getElementById('redirectOverlay');
  if (overlay) {
    setTimeout(function () {
      overlay.classList.remove('active');
    }, 2500);
  }

  // ── Populate checkout data from selected plan ──
  var checkoutPlanName  = document.getElementById('checkoutPlanName');
  var checkoutPlanSub   = document.getElementById('checkoutPlanSub');
  var checkoutPlanPrice = document.getElementById('checkoutPlanPrice');
  var summaryName       = document.getElementById('summaryPlanNameBottom');
  var summaryPrice      = document.getElementById('summaryPlanPriceBottom');
  var summaryTotal      = document.getElementById('summaryTotalPriceBottom');

  if (checkoutPlanName)  checkoutPlanName.textContent  = data.name;
  if (checkoutPlanSub)   checkoutPlanSub.textContent   = data.sub;
  if (checkoutPlanPrice) checkoutPlanPrice.textContent  = data.price;
  if (summaryName)       summaryName.textContent        = data.name;
  if (summaryPrice)      summaryPrice.textContent       = data.price + '/month';
  if (summaryTotal)      summaryTotal.textContent       = data.price;

  // ── Change plan → go back to main page ──
  var changePlanBtn = document.getElementById('checkoutChangePlan');
  if (changePlanBtn) {
    changePlanBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.location.href = 'index.html?view=premium';
    });
  }

  // ── QR Payment Page logic ──
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

      // After 2.2s show QR page and reset loading state
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

// ── Address Edit (Checkout Page) ─────────────────────────────────────────────
(function () {
  var addressBox      = document.getElementById('addressBox');
  var addressDisplay  = document.getElementById('addressDisplay');
  var addressEditForm = document.getElementById('addressEditForm');
  var addressEditBtn  = document.getElementById('addressEditBtn');
  var addressSaveBtn  = document.getElementById('addressSaveBtn');
  var addressCancelBtn = document.getElementById('addressCancelBtn');
  var stateSelect     = document.getElementById('stateSelect');
  var citySelect      = document.getElementById('citySelect');
  var addressCityEl   = document.getElementById('addressCity');
  var addressStateEl  = document.getElementById('addressState');

  if (!addressBox || !addressDisplay || !addressEditForm) return;

  // City data for each state
  var cityData = {
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
  var populateCities = function (state) {
    citySelect.innerHTML = '<option value="">— Select City —</option>';
    var cities = cityData[state];
    if (cities) {
      cities.forEach(function (city) {
        var opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        citySelect.appendChild(opt);
      });
    }
  };

  // When state changes, refresh city list
  stateSelect.addEventListener('change', function () {
    populateCities(stateSelect.value);
  });

  // Open edit form
  addressEditBtn.addEventListener('click', function () {
    addressDisplay.style.display = 'none';
    addressEditForm.style.display = 'block';
    addressBox.classList.add('editing');

    // Pre-select current state & populate cities
    var currentState = addressStateEl.textContent.trim();
    stateSelect.value = currentState;
    populateCities(currentState);

    // Pre-select current city
    var currentCity = addressCityEl.textContent.trim();
    if (citySelect.querySelector('option[value="' + currentCity + '"]')) {
      citySelect.value = currentCity;
    }
  });

  // Save
  addressSaveBtn.addEventListener('click', function () {
    var newState = stateSelect.value;
    var newCity  = citySelect.value;

    if (!newState) { stateSelect.focus(); return; }
    if (!newCity)  { citySelect.focus();  return; }

    addressStateEl.textContent = newState;
    addressCityEl.textContent  = newCity;

    addressEditForm.style.display = 'none';
    addressDisplay.style.display  = 'flex';
    addressBox.classList.remove('editing');
  });

  // Cancel
  addressCancelBtn.addEventListener('click', function () {
    addressEditForm.style.display = 'none';
    addressDisplay.style.display  = 'flex';
    addressBox.classList.remove('editing');
  });
})();

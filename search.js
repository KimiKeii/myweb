const minRange = document.getElementById('min-range');
const maxRange = document.getElementById('max-range');
const minPrice = document.getElementById('min-price');
const maxPrice = document.getElementById('max-price');
const citySelect = document.getElementById('city');
const typeSelect = document.getElementById('type');
const iframeMap = document.querySelector("iframe");

// Example options with price values for demonstration, including coordinates for map updates
const options = [
  { city: "MAKATI, METRO MANILA", type: "RFO", price: 11200},
  { city: "SILANG, CAVITE", type: "RFO", price: 12000},
  { city: "TAGAYTAY, CAVITE", type: "RFO", price: 13500},
  { city: "SUBIC, ZAMBALES", type: "RFO", price: 17000},
  { city: "NAGUILIAN, LA UNiON", type: "RFO", price: 23000},
  { city: "PORAC, PAMPANGA", type: "RFO", price: 25000},
  { city: "BAGUIO, BANGUET", type: "RFO", price: 28000},
  { city: "BIÑAN, LAGUNA", type: "RFO", price: 29000},
  { city: "DAVAO, DAVAO", type: "RFO", price: 29500},
  { city: "BORACAY, AKLAN", type: "RFO", price: 40000},
];

// Function to format price
function formatPrice(value) {
  return '₱' + Number(value).toLocaleString();
}

// Update the price display when the range sliders are moved
minRange.addEventListener('input', () => {
  let minVal = parseInt(minRange.value);
  let maxVal = parseInt(maxRange.value);

  // Prevent min from going above max
  if (minVal > maxVal) {
    minVal = maxVal;
    minRange.value = minVal;
  }

  minPrice.textContent = formatPrice(minVal);

  // Filter options based on the new price range
  updateOptions(minVal, maxVal);
});

maxRange.addEventListener('input', () => {
  let minVal = parseInt(minRange.value);
  let maxVal = parseInt(maxRange.value);

  // Prevent max from going below min
  if (maxVal < minVal) {
    maxVal = minVal;
    maxRange.value = maxVal;
  }

  maxPrice.textContent = formatPrice(maxVal);

  // Filter options based on the new price range
  updateOptions(minVal, maxVal);
});

// Function to update the options based on the price range
function updateOptions(minVal, maxVal) {
  const filteredOptions = options.filter(option => option.price >= minVal && option.price <= maxVal);

  // Clear the current options in the select dropdowns
  citySelect.innerHTML = '';
  typeSelect.innerHTML = '';

  // Get unique cities and types from the filtered options
  const cities = new Set(filteredOptions.map(option => option.city));
  const types = new Set(filteredOptions.map(option => option.type));

  // Add the filtered options back to the dropdowns
  cities.forEach(city => {
    const option = document.createElement('option');
    option.textContent = city;
    citySelect.appendChild(option);
  });

  types.forEach(type => {
    const option = document.createElement('option');
    option.textContent = type;
    typeSelect.appendChild(option);
  });

  // If there are filtered options, automatically select the first city and show it on the map
  if (filteredOptions.length > 0) {
    citySelect.value = filteredOptions[0].city;
    showCityOnMap(filteredOptions[0]);
  } else {
    // If no options are available, load the world map
    loadWorldMap();
  }
}

// Function to update map iframe based on the selected city
function showCityOnMap(city) {
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3856.0992250841945!2d${city.lng}!3d${city.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3396714fd6c9a49f%3A0xe6a3a15d118bd539!2s${encodeURIComponent(city.city)}!5e0!3m2!1sen!2sph!4v1643779851345!5m2!1sen!2sph`;
  iframeMap.src = mapUrl;
}

// Function to load the Philippines map as the default view when no options match
function loadWorldMap() {
  const philippinesMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25185870.727101218!2d115.54645584059567!3d12.745616659639073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f6!3m3!1m2!1s0x33a98d03e38eb9e1%3A0x5e82a796f0b7c4f0!2sPhilippines!5e0!3m2!1sen!2sph!4v1712653370606!5m2!1sen!2sph";
  iframeMap.src = philippinesMapUrl;
}

// Initialize the options display based on the initial price range
updateOptions(parseInt(minRange.value), parseInt(maxRange.value));

// Set the initial max range value to 0 when the page loads
window.addEventListener('load', () => {
  maxRange.value = 0;
  maxPrice.textContent = formatPrice(maxRange.value);  // Update the max price display
  updateOptions(parseInt(minRange.value), parseInt(maxRange.value));
});

// Add event listener to update the map when a city is selected
citySelect.addEventListener('change', () => {
  const selectedCity = citySelect.value;
  const city = options.find(option => option.city === selectedCity);

  if (city) {
    showCityOnMap(city);
  }
});

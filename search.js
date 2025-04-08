const minRange = document.getElementById('min-range');
const maxRange = document.getElementById('max-range');
const minPrice = document.getElementById('min-price');
const maxPrice = document.getElementById('max-price');
const citySelect = document.getElementById('city');
const typeSelect = document.getElementById('type');

// Example options with price values for demonstration
const options = [
  { city: "SILANG, CAVITE", type: "RFO", price: 12000 },
  { city: "PORAC, PAMPANGA", type: "RFO", price: 25000 },
  { city: "BIÑAN, LAGUNA", type: "RFO", price: 15000 },
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
}

// Initialize the options display based on the initial price range
updateOptions(parseInt(minRange.value), parseInt(maxRange.value));

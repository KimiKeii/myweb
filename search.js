const minRange = document.getElementById('min-range');
const maxRange = document.getElementById('max-range');
const minPrice = document.getElementById('min-price');
const maxPrice = document.getElementById('max-price');

function formatPrice(value) {
  return '₱' + Number(value).toLocaleString();
}

minRange.addEventListener('input', () => {
  let minVal = parseInt(minRange.value);
  let maxVal = parseInt(maxRange.value);

  // Prevent min from going above max
  if (minVal > maxVal) {
    minVal = maxVal;
    minRange.value = minVal;
  }

  minPrice.textContent = formatPrice(minVal);
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
});

// Get reference to the university select element
const universitySelect = document.getElementById('universitySelect');

// Add event listener for when the selection changes
universitySelect.addEventListener('change', function() {
	// Get the selected value (which is the URL path)
	const selectedValue = universitySelect.value;

	// If a university is selected (not the placeholder), redirect to that page
	if (selectedValue) {
		window.location.href = selectedValue;
	}
});
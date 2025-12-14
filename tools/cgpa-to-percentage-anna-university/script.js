// Get references to the HTML elements
const cgpaInput = document.getElementById('cgpaInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Add event listener to the calculate button
calculateBtn.addEventListener('click', function() {
	// Get the CGPA value from the input field
	const cgpa = parseFloat(cgpaInput.value);

	// Clear any previous result
	resultDiv.innerHTML = '';
	resultDiv.className = '';

	// Validate the input
	if (isNaN(cgpa)) {
		// If the input is not a number, show an error
		resultDiv.innerHTML = 'Please enter a valid CGPA number.';
		resultDiv.className = 'error';
		return;
	}

	if (cgpa < 0 || cgpa > 10) {
		// If the CGPA is outside the valid range, show an error
		resultDiv.innerHTML = 'CGPA must be between 0 and 10.';
		resultDiv.className = 'error';
		return;
	}

	// Calculate the percentage using Anna University's formula
	// Percentage = (CGPA × 10) − 7.5
	const percentage = (cgpa * 10) - 7.5;

	// Round to 2 decimal places
	const roundedPercentage = Math.round(percentage * 100) / 100;

	// Display the result
	resultDiv.innerHTML = `Your percentage is: ${roundedPercentage}%`;
	resultDiv.className = 'success';
});
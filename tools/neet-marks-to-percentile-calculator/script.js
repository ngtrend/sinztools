// Get references to the HTML elements
const marksInput = document.getElementById('marksInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Add event listener to the calculate button
calculateBtn.addEventListener('click', function() {
	// Get the marks from the input field
	const marks = parseFloat(marksInput.value);

	// Clear any previous result
	resultDiv.innerHTML = '';
	resultDiv.className = '';

	// Validate the input
	if (isNaN(marks)) {
		resultDiv.innerHTML = 'Please enter valid NEET marks.';
		resultDiv.className = 'error';
		return;
	}

	if (marks < 0 || marks > 720) {
		resultDiv.innerHTML = 'NEET marks must be between 0 and 720.';
		resultDiv.className = 'error';
		return;
	}

	// Calculate the estimated percentile
	// Estimated Percentile = (Marks / 720) × 100
	const percentile = (marks / 720) * 100;

	// Round to 2 decimal places
	const roundedPercentile = Math.round(percentile * 100) / 100;

	// Display the result
	resultDiv.innerHTML = `Estimated Percentile: ${roundedPercentile}%`;
	resultDiv.className = 'success';
});
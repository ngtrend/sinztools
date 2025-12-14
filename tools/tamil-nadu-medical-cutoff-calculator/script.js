// Get references to the HTML elements
const biologyInput = document.getElementById('biologyInput');
const physicsInput = document.getElementById('physicsInput');
const chemistryInput = document.getElementById('chemistryInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Add event listener to the calculate button
calculateBtn.addEventListener('click', function() {
	// Get the marks from the input fields
	const biology = parseFloat(biologyInput.value);
	const physics = parseFloat(physicsInput.value);
	const chemistry = parseFloat(chemistryInput.value);

	// Clear any previous result
	resultDiv.innerHTML = '';
	resultDiv.className = '';

	// Validate the inputs
	if (isNaN(biology) || isNaN(physics) || isNaN(chemistry)) {
		resultDiv.innerHTML = 'Please enter valid marks for all subjects.';
		resultDiv.className = 'error';
		return;
	}

	if (biology < 0 || biology > 100) {
		resultDiv.innerHTML = 'Biology marks must be between 0 and 100.';
		resultDiv.className = 'error';
		return;
	}

	if (physics < 0 || physics > 100) {
		resultDiv.innerHTML = 'Physics marks must be between 0 and 100.';
		resultDiv.className = 'error';
		return;
	}

	if (chemistry < 0 || chemistry > 100) {
		resultDiv.innerHTML = 'Chemistry marks must be between 0 and 100.';
		resultDiv.className = 'error';
		return;
	}

	// Calculate the medical cut-off using the Tamil Nadu formula
	// Medical Cut-off = (Biology / 2) + (Physics / 4) + (Chemistry / 4)
	const cutoff = (biology / 2) + (physics / 4) + (chemistry / 4);

	// Round to 2 decimal places
	const roundedCutoff = Math.round(cutoff * 100) / 100;

	// Display the result
	resultDiv.innerHTML = `Your Medical Cut-off: ${roundedCutoff} / 100`;
	resultDiv.className = 'success';
});
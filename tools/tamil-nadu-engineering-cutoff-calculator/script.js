// Get references to the HTML elements
const mathsInput = document.getElementById('mathsInput');
const physicsInput = document.getElementById('physicsInput');
const chemistryInput = document.getElementById('chemistryInput');
const calculateBtn = document.getElementById('calculateBtn');
const resultDiv = document.getElementById('result');

// Add event listener to the calculate button
calculateBtn.addEventListener('click', function() {
	// Get the marks from the input fields
	const maths = parseFloat(mathsInput.value);
	const physics = parseFloat(physicsInput.value);
	const chemistry = parseFloat(chemistryInput.value);

	// Clear any previous result
	resultDiv.innerHTML = '';
	resultDiv.className = '';

	// Validate the inputs
	if (isNaN(maths) || isNaN(physics) || isNaN(chemistry)) {
		resultDiv.innerHTML = 'Please enter valid marks for all subjects.';
		resultDiv.className = 'error';
		return;
	}

	if (maths < 0 || maths > 200) {
		resultDiv.innerHTML = 'Mathematics marks must be between 0 and 200.';
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

	// Calculate the cutoff using the Tamil Nadu formula
	// Cutoff = (Maths / 2) + (Physics / 4) + (Chemistry / 4)
	const cutoff = (maths / 2) + (physics / 4) + (chemistry / 4);

	// Round to 2 decimal places
	const roundedCutoff = Math.round(cutoff * 100) / 100;

	// Display the result
	resultDiv.innerHTML = `Your cutoff is: ${roundedCutoff}`;
	resultDiv.className = 'success';
});
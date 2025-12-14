// TNEA Engineering Fee Estimator Script

// Fixed fee ranges (in rupees)
const fees = {
	government: { tuition: [10000, 25000], hostel: [20000, 35000] },
	aided: { tuition: [20000, 50000], hostel: [25000, 40000] },
	private: { tuition: [60000, 150000], hostel: [40000, 70000] }
};

document.getElementById('estimateBtn').addEventListener('click', function() {
	const collegeType = document.getElementById('collegeType').value;
	const category = document.getElementById('category').value;
	const hostel = document.getElementById('hostel').value;
	const resultDiv = document.getElementById('result');

	if (!collegeType || !category) {
		resultDiv.innerHTML = '<p>Please select college type and category.</p>';
		return;
	}

	const tuition = fees[collegeType].tuition;
	let totalMin = tuition[0];
	let totalMax = tuition[1];

	if (hostel === 'yes') {
		totalMin += fees[collegeType].hostel[0];
		totalMax += fees[collegeType].hostel[1];
	}

	let explanation = `Estimated annual fee: ₹${totalMin.toLocaleString()} – ₹${totalMax.toLocaleString()}`;

	if (category === 'sc' || category === 'st') {
		explanation += '<br>Note: SC/ST students may be eligible for fee concessions.';
	}

	resultDiv.innerHTML = `<p>${explanation}</p>`;
});
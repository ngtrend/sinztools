// Tamil Nadu Pharmacy Fee Estimator Script

// Fixed fee ranges (in rupees)
const fees = {
	bpharm: { government: [30000, 60000], private: [60000, 150000] },
	pharmd: { government: [50000, 100000], private: [200000, 400000] },
	dpharm: { government: [20000, 40000], private: [40000, 80000] }
};

const hostelFee = [25000, 60000];

document.getElementById('estimateBtn').addEventListener('click', function() {
	const course = document.getElementById('course').value;
	const collegeType = document.getElementById('collegeType').value;
	const hostel = document.getElementById('hostel').value;
	const resultDiv = document.getElementById('result');

	if (!course || !collegeType) {
		resultDiv.innerHTML = '<p>Please select course and college type.</p>';
		return;
	}

	const tuition = fees[course][collegeType];
	let totalMin = tuition[0];
	let totalMax = tuition[1];

	if (hostel === 'yes') {
		totalMin += hostelFee[0];
		totalMax += hostelFee[1];
	}

	const explanation = `Estimated annual fee: ₹${totalMin.toLocaleString()} – ₹${totalMax.toLocaleString()}`;

	resultDiv.innerHTML = `<p>${explanation}</p>`;
});
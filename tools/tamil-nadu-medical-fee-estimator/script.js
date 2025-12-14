// Tamil Nadu Medical Fee Estimator Script

// Fixed fee ranges (in rupees) - base values
const baseFees = {
	government: { tuition: [15000, 30000], hostel: [25000, 40000] },
	aided: { tuition: [30000, 75000], hostel: [30000, 45000] },
	private: { tuition: [500000, 1500000], hostel: [60000, 100000] },
	deemed: { tuition: [1000000, 2500000], hostel: [75000, 125000] }
};

// Course multipliers for tuition (relative to base)
const courseMultipliers = {
	mbbs: 1.0,
	bds: 0.9,
	ayush: 0.6,
	allied: 0.5
};

document.getElementById('estimateBtn').addEventListener('click', function() {
	const courseType = document.getElementById('courseType').value;
	const collegeType = document.getElementById('collegeType').value;
	const hostel = document.getElementById('hostel').value;
	const resultDiv = document.getElementById('result');

	if (!courseType || !collegeType) {
		resultDiv.innerHTML = '<p>Please select course type and college type.</p>';
		return;
	}

	const base = baseFees[collegeType];
	const multiplier = courseMultipliers[courseType];

	let tuitionMin = Math.round(base.tuition[0] * multiplier);
	let tuitionMax = Math.round(base.tuition[1] * multiplier);
	let totalMin = tuitionMin;
	let totalMax = tuitionMax;

	if (hostel === 'yes') {
		totalMin += base.hostel[0];
		totalMax += base.hostel[1];
	}

	let explanation = `Estimated annual fee: ₹${totalMin.toLocaleString()} – ₹${totalMax.toLocaleString()}`;

	// Add course-specific notes
	if (courseType === 'mbbs') {
		explanation += '<br>MBBS typically has higher fee ranges among medical courses.';
	} else if (courseType === 'ayush' || courseType === 'allied') {
		explanation += '<br>AYUSH and allied courses generally have lower fee ranges.';
	}

	resultDiv.innerHTML = `<p>${explanation}</p>`;
});
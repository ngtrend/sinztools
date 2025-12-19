// WEBP to PNG Converter script

document.addEventListener('DOMContentLoaded', function() {
	const fileInput = document.getElementById('fileInput');
	const preview = document.getElementById('preview');
	const originalImage = document.getElementById('originalImage');
	const convertBtn = document.getElementById('convertBtn');
	const result = document.getElementById('result');
	const convertedImage = document.getElementById('convertedImage');
	const downloadBtn = document.getElementById('downloadBtn');

	// Update label text when file is selected
	fileInput.addEventListener('change', function() {
		const fileName = this.files[0] ? this.files[0].name : 'Choose File';
		document.getElementById('fileInputLabel').textContent = fileName;
	});
	const errorDiv = document.getElementById('error');

	// Handle file selection
	fileInput.addEventListener('change', function(e) {
		const file = e.target.files[0];
		if (!file) return;

		// Validate file type
		if (!file.type.includes('webp')) {
			showError('Please select a WEBP image file.');
			return;
		}

		// Clear previous results
		hideElements();
		errorDiv.classList.add('hidden');

		// Show preview
		const reader = new FileReader();
		reader.onload = function(e) {
			originalImage.src = e.target.result;
			preview.classList.remove('hidden');
			convertBtn.classList.remove('hidden');
		};
		reader.readAsDataURL(file);
	});

	// Handle conversion
	convertBtn.addEventListener('click', function() {
		const img = new Image();
		img.onload = function() {
			// Create canvas
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = img.width;
			canvas.height = img.height;

			// Draw image on canvas
			ctx.drawImage(img, 0, 0);

			// Convert to PNG blob
			canvas.toBlob(function(blob) {
				const url = URL.createObjectURL(blob);
				convertedImage.src = url;
				result.classList.remove('hidden');

				// Set download link
				downloadBtn.href = url;
				downloadBtn.download = 'converted.png';
			}, 'image/png');
		};
		img.src = originalImage.src;
	});

	function showError(message) {
		errorDiv.textContent = message;
		errorDiv.classList.remove('hidden');
		hideElements();
	}

	function hideElements() {
		preview.classList.add('hidden');
		convertBtn.classList.add('hidden');
		result.classList.add('hidden');
	}
});
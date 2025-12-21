// WEBP to PNG Converter script

document.addEventListener('DOMContentLoaded', function() {
	const fileInput = document.getElementById('fileInput');
	const dropZone = document.getElementById('dropZone');
	const convertBtn = document.getElementById('convertBtn');
	const output = document.getElementById('output');
	const fileInfo = document.getElementById('fileInfo');
	const fileName = document.getElementById('fileName');
	const fileSize = document.getElementById('fileSize');

	let originalFile = null;

	// Initialize image upload handler
	initImageUpload(dropZone, fileInput, (img, file) => {
		originalFile = file;
		// Clear any previous results and errors
		errorHandler.clearError();
		output.innerHTML = '';

		// Show file info
		fileName.textContent = file.name;
		fileSize.textContent = formatFileSize(file.size);
		fileInfo.style.display = 'block';
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
				const a = document.createElement('a');
				a.href = url;
				a.download = 'converted.png';
				a.textContent = 'Download PNG Image';
				a.style.display = 'inline-block';
				a.style.padding = '10px 20px';
				a.style.backgroundColor = '#28a745';
				a.style.color = 'white';
				a.style.textDecoration = 'none';
				a.style.borderRadius = '5px';

				// Display results
				output.innerHTML = `<p>Conversion complete! File size: ${(blob.size / 1024).toFixed(1)} KB</p>`;
				output.appendChild(a);
			}, 'image/png');
		};
		img.src = URL.createObjectURL(originalFile);
	});
});
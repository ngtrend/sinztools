// Get references to the HTML elements
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
    // Clear any previous output
    output.innerHTML = '';

    // Show file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';
});

// Add event listener to the convert button
convertBtn.addEventListener('click', function () {
	if (!originalFile) {
		errorHandler.showError('Please select a WEBP image file.');
		return;
	}

	// Clear previous output
	output.innerHTML = '';

	// Create image element to load the file
	const img = new Image();
	img.onload = function () {
		// Create canvas element
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set canvas dimensions to match image
		canvas.width = img.width;
		canvas.height = img.height;

		// Fill canvas with white background (since JPG doesn't support transparency)
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		// Draw the image onto the canvas
		ctx.drawImage(img, 0, 0);

		// Convert canvas to JPG blob
		canvas.toBlob(function (blob) {
			// Create download link
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'converted.jpg';
			a.textContent = 'Download Converted JPG';
			a.style.display = 'inline-block';
			a.style.padding = '10px 20px';
			a.style.backgroundColor = '#28a745';
			a.style.color = 'white';
			a.style.textDecoration = 'none';
			a.style.borderRadius = '5px';

			// Display success message and download link
			output.innerHTML = '<p>Conversion complete! Transparent areas have been filled with white.</p>';
			output.appendChild(a);
		}, 'image/jpeg');
	};

	// Show preview of the selected image
	const previewImg = document.createElement('img');
	previewImg.src = URL.createObjectURL(file);
	previewImg.alt = 'Preview of selected WEBP image';
	preview.innerHTML = '<p>Preview:</p>';
	preview.appendChild(previewImg);

	// Load the image
	img.src = URL.createObjectURL(file);
});
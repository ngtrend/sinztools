const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const formatSelect = document.getElementById('formatSelect');
const convertBtn = document.getElementById('convertBtn');
const output = document.getElementById('output');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');

let currentImage = null;
let currentFile = null;

// Initialize button state
convertBtn.disabled = true;

// Initialize image upload handler
initImageUpload(dropZone, fileInput, (img, file) => {
    currentImage = img;
    currentFile = file;
    output.innerHTML = ''; // Clear previous output

    // Show file info
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    fileInfo.style.display = 'block';
    
    // Enable convert button
    convertBtn.disabled = false;
});

convertBtn.addEventListener('click', function () {
	if (!currentImage || !currentFile) {
		errorHandler.showError('Please select an image file.');
		return;
	}

	const format = formatSelect.value;
	const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;

	// Check if WEBP is supported
	if (format === 'webp' && !document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')) {
		errorHandler.showError('WEBP format is not supported in this browser.');
		return;
	}

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	canvas.width = currentImage.width;
	canvas.height = currentImage.height;
	ctx.drawImage(currentImage, 0, 0);

	canvas.toBlob(function (blob) {
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `converted.${format}`;
		a.textContent = 'Download Converted Image';
		a.style.display = 'inline-block';
		a.style.padding = '10px 20px';
		a.style.backgroundColor = '#28a745';
		a.style.color = 'white';
		a.style.textDecoration = 'none';
		a.style.borderRadius = '5px';
		output.innerHTML = '<p>Conversion complete!</p>';
		output.appendChild(a);
	}, mimeType);
});
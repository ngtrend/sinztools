const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const aspectRatioCheckbox = document.getElementById('aspectRatioCheckbox');
const formatSelect = document.getElementById('formatSelect');
const infoDisplay = document.getElementById('infoDisplay');
const resizeBtn = document.getElementById('resizeBtn');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('downloadBtn');
const originalCanvas = document.getElementById('originalCanvas');
const resizedCanvas = document.getElementById('resizedCanvas');
const errorMessage = document.getElementById('errorMessage');

// Hide error message by default
errorMessage.style.display = 'none';

// Initialize button state
resizeBtn.disabled = true;

let originalImage = null;
let originalAspectRatio = 1;
let originalFile = null;

// Initialize image selection handler
initImageUpload(dropZone, fileInput, (img, file) => {
    originalImage = img;
    originalFile = file;
    originalAspectRatio = img.width / img.height;

    // Set canvas size and draw original
    originalCanvas.width = img.width;
    originalCanvas.height = img.height;
    const originalCtx = originalCanvas.getContext('2d');
    originalCtx.drawImage(img, 0, 0);

    // Set default dimensions
    widthInput.value = img.width;
    heightInput.value = img.height;

    // Update info display
    updateInfoDisplay();

    // Clear resized canvas
    const resizedCtx = resizedCanvas.getContext('2d');
    resizedCtx.clearRect(0, 0, resizedCanvas.width, resizedCanvas.height);
    downloadBtn.classList.remove('visible');
    
    // Enable resize button
    resizeBtn.disabled = false;
});

// Preset buttons
document.querySelectorAll('.preset-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		const width = parseInt(btn.dataset.width);
		const height = parseInt(btn.dataset.height);
		widthInput.value = width;
		heightInput.value = height;
		if (aspectRatioCheckbox.checked) {
			originalAspectRatio = width / height;
		}
	});
});

// Percentage buttons
document.querySelectorAll('.percentage-btn').forEach(btn => {
	btn.addEventListener('click', () => {
		if (!originalImage) return;
		const percentage = parseInt(btn.dataset.percentage) / 100;
		const newWidth = Math.round(originalImage.width * percentage);
		const newHeight = Math.round(originalImage.height * percentage);
		widthInput.value = newWidth;
		heightInput.value = newHeight;
	});
});

// Aspect ratio checkbox
aspectRatioCheckbox.addEventListener('change', () => {
	if (aspectRatioCheckbox.checked && originalImage) {
		const currentWidth = parseInt(widthInput.value) || originalImage.width;
		heightInput.value = Math.round(currentWidth / originalAspectRatio);
	}
});

function updateInfoDisplay() {
	if (!originalImage || !originalFile) {
		infoDisplay.textContent = '';
		return;
	}
	const originalSize = (originalFile.size / 1024).toFixed(1);
	infoDisplay.textContent = `Original: ${originalImage.width}x${originalImage.height} (${originalSize} KB)`;
}

widthInput.addEventListener('input', () => {
	if (aspectRatioCheckbox.checked && originalImage) {
		const newWidth = parseInt(widthInput.value) || originalImage.width;
		heightInput.value = Math.round(newWidth / originalAspectRatio);
	}
});

heightInput.addEventListener('input', () => {
	if (aspectRatioCheckbox.checked && originalImage) {
		const newHeight = parseInt(heightInput.value) || originalImage.height;
		widthInput.value = Math.round(newHeight * originalAspectRatio);
	}
});

aspectRatioCheckbox.addEventListener('change', () => {
	if (aspectRatioCheckbox.checked && originalImage) {
		// Recalculate based on current width
		const currentWidth = parseInt(widthInput.value) || originalImage.width;
		heightInput.value = Math.round(currentWidth / originalAspectRatio);
	}
});

resizeBtn.addEventListener('click', () => {
	if (!originalImage) {
		errorHandler.showError('Please select an image first.');
		return;
	}

	const newWidth = parseInt(widthInput.value);
	const newHeight = parseInt(heightInput.value);

	if (!newWidth || !newHeight || newWidth < 1 || newHeight < 1) {
		errorHandler.showError('Please enter valid dimensions (both width and height must be greater than 0).');
		return;
	}

	loader.style.display = 'block';
	resizeBtn.disabled = true;

	// Resize using canvas
	resizedCanvas.width = newWidth;
	resizedCanvas.height = newHeight;
	const resizedCtx = resizedCanvas.getContext('2d');
	resizedCtx.drawImage(originalImage, 0, 0, newWidth, newHeight);

let currentMimeType = 'image/jpeg';

	// Get the output format
	const format = formatSelect.value;
	currentMimeType = 'image/jpeg';
	if (format === 'png') currentMimeType = 'image/png';
	else if (format === 'webp') currentMimeType = 'image/webp';
	else if (format === 'original') {
		// Keep original format
		const originalType = originalFile.type;
		currentMimeType = originalType || 'image/jpeg';
	}

	// Get data URL to calculate size
	const dataURL = resizedCanvas.toDataURL(currentMimeType);
	const resizedSize = Math.round((dataURL.length * 3) / 4 / 1024); // Approximate size in KB

	// Update info display with before/after
	const originalSize = (originalFile.size / 1024).toFixed(1);
	infoDisplay.textContent = `Original: ${originalImage.width}x${originalImage.height} (${originalSize} KB) | Resized: ${newWidth}x${newHeight} (${resizedSize} KB)`;

	loader.style.display = 'none';
	resizeBtn.disabled = false;
	downloadBtn.classList.add('visible');
});

downloadBtn.addEventListener('click', () => {
	const link = document.createElement('a');
	const fileName = fileInput.files[0].name;
	const originalExtension = fileName.split('.').pop().toLowerCase();
	
	let extension = originalExtension;
	if (formatSelect.value !== 'original') {
		if (formatSelect.value === 'jpg') extension = 'jpg';
		else if (formatSelect.value === 'png') extension = 'png';
		else if (formatSelect.value === 'webp') extension = 'webp';
	}
	
	link.download = fileName.replace(/\.[^/.]+$/, '') + '_resized.' + extension;
	link.href = resizedCanvas.toDataURL(currentMimeType);
	link.click();
});
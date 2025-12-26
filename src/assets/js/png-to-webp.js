// Get DOM elements
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const convertBtn = document.getElementById('convertBtn');
const output = document.getElementById('output');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');

let currentImage = null;
let currentFile = null;

// Initialize button state
convertBtn.disabled = true;

// Initialize image selection handler
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

// Add event listener to convert button
convertBtn.addEventListener('click', function() {
    // Clear any previous error message
    errorHandler.clearError();

    if (!currentImage || !currentFile) {
        errorHandler.showError('Please select a PNG file.');
        return;
    }

    // Check if it's a PNG
    if (!currentFile.type.startsWith('image/png')) {
        errorHandler.showError('Please select a valid PNG file.');
        return;
    }

    // Check if WEBP is supported
    if (!document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')) {
        errorHandler.showError('WEBP format is not supported in this browser.');
        return;
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;

    // Draw image to canvas
    ctx.drawImage(currentImage, 0, 0);

    // Convert to WEBP using toBlob
    canvas.toBlob(function(blob) {
        // Create download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted.webp';
        a.textContent = 'Download WEBP Image';
        a.style.display = 'inline-block';
        a.style.padding = '10px 20px';
        a.style.backgroundColor = '#28a745';
        a.style.color = 'white';
        a.style.textDecoration = 'none';
        a.style.borderRadius = '5px';
        output.innerHTML = '<p>Conversion complete!</p>';
        output.appendChild(a);
    }, 'image/webp');
});
const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const downloadBtn = document.getElementById('downloadBtn');
const errorMessage = document.getElementById('errorMessage');

// Text watermark controls
const watermarkText = document.getElementById('watermarkText');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const textColor = document.getElementById('textColor');
const textOpacity = document.getElementById('textOpacity');
const textOpacityValue = document.getElementById('textOpacityValue');
const fontFamily = document.getElementById('fontFamily');

// Position controls
const positionButtons = document.querySelectorAll('.position-btn');

let originalImage = null;
let originalFile = null;
let currentPosition = 'top-left';

// Hide error message by default
errorMessage.style.display = 'none';

// Initialize image selection handler for main image
initImageUpload(dropZone, fileInput, (img, file) => {
    originalImage = img;
    originalFile = file;

    // Set canvas size and draw original
    canvas.width = img.width;
    canvas.height = img.height;

    // Show download button
    downloadBtn.classList.add('visible');

    // Update preview with current watermark settings
    updatePreview();
});

// Position buttons
positionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        positionButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPosition = btn.dataset.position;
        updatePreview();
    });
});

// Slider value updates
fontSize.addEventListener('input', () => {
    fontSizeValue.textContent = fontSize.value + 'px';
    updatePreview();
});

textOpacity.addEventListener('input', () => {
    textOpacityValue.textContent = Math.round(textOpacity.value * 100) + '%';
    updatePreview();
});

// Other input changes
watermarkText.addEventListener('input', updatePreview);
textColor.addEventListener('input', updatePreview);
fontFamily.addEventListener('change', updatePreview);

// Download
downloadBtn.addEventListener('click', () => {
    if (!originalImage) return;

    const link = document.createElement('a');
    link.download = 'watermarked_' + originalFile.name;
    link.href = canvas.toDataURL(originalFile.type);
    link.click();
});

function updatePreview() {
    if (!originalImage) return;

    // Clear and redraw original
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(originalImage, 0, 0);

    // Draw watermark preview
    drawWatermark();
}

function drawWatermark() {
    if (!originalImage || !watermarkText.value.trim()) return;

    ctx.save();

    // Text watermark
    ctx.font = `${fontSize.value}px ${fontFamily.value}`;
    ctx.fillStyle = textColor.value;
    ctx.globalAlpha = textOpacity.value;

    const text = watermarkText.value;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = parseInt(fontSize.value);

    let x, y;
    switch (currentPosition) {
        case 'top-left':
            x = 10;
            y = textHeight + 10;
            break;
        case 'top-right':
            x = canvas.width - textWidth - 10;
            y = textHeight + 10;
            break;
        case 'center':
            x = (canvas.width - textWidth) / 2;
            y = (canvas.height + textHeight) / 2;
            break;
        case 'bottom-left':
            x = 10;
            y = canvas.height - 10;
            break;
        case 'bottom-right':
            x = canvas.width - textWidth - 10;
            y = canvas.height - 10;
            break;
    }

    ctx.fillText(text, x, y);
    ctx.restore();
}
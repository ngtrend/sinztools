// Shared utility functions for SinzTools

// Error message handling
class ErrorHandler {
    constructor() {
        this.errorMessage = document.getElementById('errorMessage');
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
        }
    }

    showError(message) {
        if (this.errorMessage) {
            this.errorMessage.textContent = message;
            this.errorMessage.style.display = 'block';
            // Auto-hide after 5 seconds
            setTimeout(() => {
                this.clearError();
            }, 5000);
        }
    }

    clearError() {
        if (this.errorMessage) {
            this.errorMessage.style.display = 'none';
            this.errorMessage.textContent = '';
        }
    }
}

// Create a global instance
const errorHandler = new ErrorHandler();

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Reusable image upload handler for all SinzTools image tools
// Usage: initImageUpload(dropZoneElement, fileInputElement, (image, file) => { ... })
// - dropZoneElement: The drop zone DOM element
// - fileInputElement: The hidden file input DOM element
// - callback: Function called with (Image object, File object) when image is loaded
function initImageUpload(dropZoneElement, fileInputElement, onImageLoaded) {
    // Drag and drop functionality
    dropZoneElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZoneElement.classList.add('dragover');
    });

    dropZoneElement.addEventListener('dragleave', (e) => {
        // Only remove dragover if we're actually leaving the drop zone
        const rect = dropZoneElement.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;

        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            dropZoneElement.classList.remove('dragover');
        }
    });

    dropZoneElement.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZoneElement.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageFile(files[0], onImageLoaded);
        }
    });

    // File input change handler
    fileInputElement.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageFile(file, onImageLoaded);
        }
    });

    function handleImageFile(file, callback) {
        if (!file.type.startsWith('image/')) {
            errorHandler.showError('Please select a valid image file.');
            return;
        }

        const img = new Image();
        img.onload = () => {
            callback(img, file);
        };
        img.onerror = () => {
            errorHandler.showError('Failed to load image. Please try another file.');
        };
        img.src = URL.createObjectURL(file);
    }
}
// PDF-lib is loaded via CDN in the layout

const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const convertBtn = document.getElementById('convertBtn');
const output = document.getElementById('output');
const imageList = document.getElementById('imageList');
const thumbnails = document.getElementById('thumbnails');
const imageCount = document.getElementById('imageCount');
const pageSize = document.getElementById('pageSize');
const orientation = document.getElementById('orientation');
const margin = document.getElementById('margin');
const loading = document.getElementById('loading');

let images = [];

// Initialize button state
convertBtn.disabled = true;

// Initialize multiple image upload handler
initMultipleImageUpload(dropZone, fileInput, (newImages) => {
    // Add new images to the list
    images = images.concat(newImages);
    updateImageList();
    convertBtn.disabled = images.length === 0;
});

// Function to handle multiple image uploads
function initMultipleImageUpload(dropZoneElement, fileInputElement, onImagesLoaded) {
    // Drag and drop functionality
    dropZoneElement.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZoneElement.classList.add('dragover');
    });

    dropZoneElement.addEventListener('dragleave', (e) => {
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
        const files = Array.from(e.dataTransfer.files);
        handleMultipleImageFiles(files, onImagesLoaded);
    });

    // File input change handler
    fileInputElement.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleMultipleImageFiles(files, onImagesLoaded);
    });

    function handleMultipleImageFiles(files, callback) {
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        if (imageFiles.length === 0) {
            errorHandler.showError('Please select valid image files.');
            return;
        }

        const loadedImages = [];
        let loadedCount = 0;

        imageFiles.forEach(file => {
            const img = new Image();
            img.onload = () => {
                loadedImages.push({ img, file, id: Date.now() + Math.random() });
                loadedCount++;
                if (loadedCount === imageFiles.length) {
                    callback(loadedImages);
                }
            };
            img.onerror = () => {
                errorHandler.showError(`Failed to load ${file.name}. Please try another file.`);
            };
            img.src = URL.createObjectURL(file);
        });
    }
}

// Update the image list display
function updateImageList() {
    thumbnails.innerHTML = '';
    imageCount.textContent = images.length;

    if (images.length === 0) {
        imageList.style.display = 'none';
        return;
    }

    imageList.style.display = 'block';

    images.forEach((item, index) => {
        const thumbnailDiv = document.createElement('div');
        thumbnailDiv.className = 'thumbnail-item';
        thumbnailDiv.innerHTML = `
            <img src="${item.img.src}" alt="Image ${index + 1}" class="thumbnail-img">
            <div class="thumbnail-info">
                <span class="thumbnail-name">${item.file.name}</span>
                <div class="thumbnail-controls">
                    <button type="button" class="move-btn move-up" ${index === 0 ? 'disabled' : ''} data-index="${index}">↑</button>
                    <button type="button" class="move-btn move-down" ${index === images.length - 1 ? 'disabled' : ''} data-index="${index}">↓</button>
                    <button type="button" class="remove-btn" data-index="${index}">✕</button>
                </div>
            </div>
        `;
        thumbnails.appendChild(thumbnailDiv);
    });

    // Add event listeners for controls
    document.querySelectorAll('.move-up').forEach(btn => {
        btn.addEventListener('click', (e) => moveImage(parseInt(e.target.dataset.index), -1));
    });
    document.querySelectorAll('.move-down').forEach(btn => {
        btn.addEventListener('click', (e) => moveImage(parseInt(e.target.dataset.index), 1));
    });
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => removeImage(parseInt(e.target.dataset.index)));
    });
}

// Move image in the list
function moveImage(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= images.length) return;

    [images[index], images[newIndex]] = [images[newIndex], images[index]];
    updateImageList();
}

// Remove image from the list
function removeImage(index) {
    images.splice(index, 1);
    updateImageList();
    convertBtn.disabled = images.length === 0;
}

// Convert images to PDF
convertBtn.addEventListener('click', async function () {
    if (images.length === 0) {
        errorHandler.showError('Please select at least one image.');
        return;
    }

    // Check if PDF-lib is loaded
    if (typeof PDFLib === 'undefined') {
        errorHandler.showError('PDF library is still loading. Please wait a moment and try again.');
        return;
    }

    // Show loading and disable button
    convertBtn.disabled = true;
    loading.classList.add('visible');

    try {
        const { PDFDocument } = PDFLib;
        const pdfDoc = await PDFDocument.create();
        const pageSizeOption = pageSize.value;
        const orientationOption = orientation.value;
        const marginOption = margin.value;

        for (const item of images) {
            const page = pdfDoc.addPage();
            const { width, height } = page.getSize();

            // Calculate dimensions based on options
            let imgWidth = item.img.width;
            let imgHeight = item.img.height;
            let pageWidth = width;
            let pageHeight = height;

            // Handle page size
            if (pageSizeOption === 'A4') {
                pageWidth = 595.28; // A4 width in points
                pageHeight = 841.89; // A4 height in points
            } else if (pageSizeOption === 'LETTER') {
                pageWidth = 612; // Letter width in points
                pageHeight = 792; // Letter height in points
            } else if (pageSizeOption === 'FIT') {
                // Fit image to page, maintaining aspect ratio
                const aspectRatio = imgWidth / imgHeight;
                if (aspectRatio > pageWidth / pageHeight) {
                    imgWidth = pageWidth;
                    imgHeight = pageWidth / aspectRatio;
                } else {
                    imgHeight = pageHeight;
                    imgWidth = pageHeight * aspectRatio;
                }
            }

            // Handle orientation
            if (orientationOption === 'LANDSCAPE') {
                [pageWidth, pageHeight] = [pageHeight, pageWidth];
            } else if (orientationOption === 'AUTO') {
                if (imgWidth > imgHeight) {
                    [pageWidth, pageHeight] = [pageHeight, pageWidth];
                }
            }

            // Set page size
            page.setSize(pageWidth, pageHeight);

            // Handle margins
            let marginSize = marginOption === 'NONE' ? 0 : 20; // Small margin
            const availableWidth = pageWidth - 2 * marginSize;
            const availableHeight = pageHeight - 2 * marginSize;

            // Scale image to fit within margins
            const scaleX = availableWidth / imgWidth;
            const scaleY = availableHeight / imgHeight;
            const scale = Math.min(scaleX, scaleY);

            const scaledWidth = imgWidth * scale;
            const scaledHeight = imgHeight * scale;

            const x = marginSize + (availableWidth - scaledWidth) / 2;
            const y = marginSize + (availableHeight - scaledHeight) / 2;

            // Convert image to PNG for PDF embedding
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = item.img.width;
            canvas.height = item.img.height;
            ctx.drawImage(item.img, 0, 0);

            const imageBytes = await fetch(canvas.toDataURL('image/png')).then(res => res.arrayBuffer());
            const pngImage = await pdfDoc.embedPng(imageBytes);

            page.drawImage(pngImage, {
                x,
                y,
                width: scaledWidth,
                height: scaledHeight,
            });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'converted-images.pdf';
        a.textContent = 'Download PDF';
        a.style.display = 'inline-block';
        a.style.padding = '10px 20px';
        a.style.backgroundColor = '#28a745';
        a.style.color = 'white';
        a.style.textDecoration = 'none';
        a.style.borderRadius = '5px';

        output.innerHTML = '<p>PDF conversion complete!</p>';
        output.appendChild(a);

    } catch (error) {
        errorHandler.showError('Failed to create PDF. Please try again.');
        console.error(error);
    } finally {
        // Hide loading and re-enable button
        convertBtn.disabled = false;
        loading.classList.remove('visible');
    }
});

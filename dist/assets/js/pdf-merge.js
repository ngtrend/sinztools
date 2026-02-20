const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const fileList = document.getElementById('fileList');
const emptyState = document.getElementById('emptyState');
const mergeBtn = document.getElementById('mergeBtn');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');

let pdfFiles = [];

// Hide error message by default
errorMessage.style.display = 'none';

// Initialize PDF selection handler
initPDFUpload(dropZone, fileInput, (files) => {
    // Add new files to the list
    files.forEach(file => {
        if (!pdfFiles.some(f => f.name === file.name && f.size === file.size)) {
            pdfFiles.push(file);
        }
    });
    updateFileList();
});

// PDF-specific selection handler (adapted from utils.js)
function initPDFUpload(dropZoneElement, fileInputElement, onFilesSelected) {
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
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
        if (files.length > 0) {
            onFilesSelected(files);
        } else {
            errorHandler.showError('Please drop PDF files only.');
        }
    });

    // File input change handler
    fileInputElement.addEventListener('change', (e) => {
        const files = Array.from(e.target.files).filter(file => file.type === 'application/pdf');
        if (files.length > 0) {
            onFilesSelected(files);
        }
    });
}

function updateFileList() {
    if (pdfFiles.length === 0) {
        emptyState.style.display = 'block';
        fileList.querySelectorAll('.file-item').forEach(item => item.remove());
        mergeBtn.disabled = true;
        return;
    }

    emptyState.style.display = 'none';
    mergeBtn.disabled = false;

    // Clear existing items
    fileList.querySelectorAll('.file-item').forEach(item => item.remove());

    // Add file items
    pdfFiles.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';

        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-name">${file.name}</div>
                <div class="file-size">${formatFileSize(file.size)}</div>
            </div>
            <div class="file-actions">
                <button class="move-btn" onclick="moveFile(${index}, -1)" ${index === 0 ? 'disabled' : ''}>↑</button>
                <button class="move-btn" onclick="moveFile(${index}, 1)" ${index === pdfFiles.length - 1 ? 'disabled' : ''}>↓</button>
                <button class="remove-btn" onclick="removeFile(${index})">Remove</button>
            </div>
        `;

        fileList.appendChild(fileItem);
    });
}

function moveFile(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= pdfFiles.length) return;

    // Swap files
    [pdfFiles[index], pdfFiles[newIndex]] = [pdfFiles[newIndex], pdfFiles[index]];
    updateFileList();
}

function removeFile(index) {
    pdfFiles.splice(index, 1);
    updateFileList();
}

// Merge PDFs
mergeBtn.addEventListener('click', async () => {
    if (pdfFiles.length < 2) {
        errorHandler.showError('Please select at least 2 PDF files to merge.');
        return;
    }

    mergeBtn.disabled = true;
    loading.classList.add('visible');

    try {
        const mergedPdf = await mergePDFs(pdfFiles);
        const blob = new Blob([mergedPdf], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = 'merged.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        errorHandler.clearError();
    } catch (error) {
        console.error('Error merging PDFs:', error);
        errorHandler.showError('Failed to merge PDFs. Please try again.');
    } finally {
        mergeBtn.disabled = false;
        loading.classList.remove('visible');
    }
});

// PDF merging function using PDF-lib
async function mergePDFs(files) {
    // PDF-lib is loaded globally via CDN
    const { PDFDocument } = PDFLib;

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);

        // Copy all pages from the current PDF to the merged PDF
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
    }

    // Serialize the merged PDF
    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
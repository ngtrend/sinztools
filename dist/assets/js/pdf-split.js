const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const pdfInfo = document.getElementById('pdfInfo');
const pdfName = document.getElementById('pdfName');
const pdfSize = document.getElementById('pdfSize');
const pdfPages = document.getElementById('pdfPages');
const pagesContainer = document.getElementById('pagesContainer');
const pageGrid = document.getElementById('pageGrid');
const selectedCount = document.getElementById('selectedCount');
const selectAllBtn = document.getElementById('selectAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const pageRange = document.getElementById('pageRange');
const splitBtn = document.getElementById('splitBtn');
const loading = document.getElementById('loading');
const output = document.getElementById('output');

let currentPdfFile = null;
let pdfDocument = null;
let totalPages = 0;
let selectedPages = new Set();

// Initialize PDF upload handler
initPDFUpload(dropZone, fileInput, (file) => {
    currentPdfFile = file;
    loadPdf(file);
});

// PDF-specific upload handler
function initPDFUpload(dropZoneElement, fileInputElement, onFileSelected) {
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
        const files = Array.from(e.dataTransfer.files).filter(file => file.type === 'application/pdf');
        if (files.length > 0) {
            onFileSelected(files[0]);
        } else {
            errorHandler.showError('Please select a PDF file.');
        }
    });

    // File input change handler
    fileInputElement.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            onFileSelected(file);
        } else {
            errorHandler.showError('Please select a valid PDF file.');
        }
    });
}

// Load and parse PDF
async function loadPdf(file) {
    try {
        // Check if PDF-lib is loaded
        if (typeof PDFLib === 'undefined') {
            errorHandler.showError('PDF library is still loading. Please wait a moment and try again.');
            return;
        }

        const { PDFDocument } = PDFLib;
        const fileBuffer = await file.arrayBuffer();
        pdfDocument = await PDFDocument.load(fileBuffer);
        totalPages = pdfDocument.getPageCount();

        // Display PDF info
        pdfName.textContent = file.name;
        pdfSize.textContent = formatFileSize(file.size);
        pdfPages.textContent = totalPages;
        pdfInfo.style.display = 'block';

        // Display pages
        displayPages();
        pagesContainer.style.display = 'block';
        splitBtn.disabled = false;

        errorHandler.clearError();
    } catch (error) {
        console.error('Error loading PDF:', error);
        errorHandler.showError('Failed to load PDF. Please try another file.');
    }
}

// Display page grid
function displayPages() {
    pageGrid.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('div');
        pageItem.className = 'page-item';
        pageItem.innerHTML = `
            <input type="checkbox" class="page-checkbox" data-page="${i}">
            <div class="page-number">Page ${i}</div>
        `;

        // Add event listener for checkbox
        const checkbox = pageItem.querySelector('.page-checkbox');
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                selectedPages.add(i);
            } else {
                selectedPages.delete(i);
            }
            updateSelectedCount();
            updatePageSelection();
        });

        pageGrid.appendChild(pageItem);
    }

    updateSelectedCount();
}

// Update selected pages count
function updateSelectedCount() {
    selectedCount.textContent = selectedPages.size;
    splitBtn.disabled = selectedPages.size === 0;
}

// Update visual selection state
function updatePageSelection() {
    document.querySelectorAll('.page-item').forEach((item, index) => {
        const pageNum = index + 1;
        if (selectedPages.has(pageNum)) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Select all pages
selectAllBtn.addEventListener('click', () => {
    selectedPages.clear();
    for (let i = 1; i <= totalPages; i++) {
        selectedPages.add(i);
    }
    updateSelectedCount();
    updatePageSelection();
    document.querySelectorAll('.page-checkbox').forEach(cb => cb.checked = true);
});

// Clear all selections
clearAllBtn.addEventListener('click', () => {
    selectedPages.clear();
    updateSelectedCount();
    updatePageSelection();
    document.querySelectorAll('.page-checkbox').forEach(cb => cb.checked = false);
});

// Handle page range input
pageRange.addEventListener('input', (e) => {
    const rangeText = e.target.value.trim();
    if (rangeText === '') return;

    try {
        const pages = parsePageRange(rangeText);
        selectedPages.clear();

        pages.forEach(page => {
            if (page >= 1 && page <= totalPages) {
                selectedPages.add(page);
            }
        });

        updateSelectedCount();
        updatePageSelection();

        // Update checkboxes
        document.querySelectorAll('.page-checkbox').forEach((cb, index) => {
            const pageNum = index + 1;
            cb.checked = selectedPages.has(pageNum);
        });
    } catch (error) {
        // Invalid range, ignore for now
    }
});

// Parse page range string (e.g., "1-3,5,7-9")
function parsePageRange(rangeStr) {
    const pages = new Set();

    const parts = rangeStr.split(',');
    parts.forEach(part => {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
            const [start, end] = trimmed.split('-').map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end) && start <= end) {
                for (let i = start; i <= end; i++) {
                    pages.add(i);
                }
            }
        } else {
            const page = parseInt(trimmed);
            if (!isNaN(page)) {
                pages.add(page);
            }
        }
    });

    return Array.from(pages).sort((a, b) => a - b);
}

// Extract selected pages
splitBtn.addEventListener('click', async () => {
    if (selectedPages.size === 0) {
        errorHandler.showError('Please select at least one page to extract.');
        return;
    }

    // Check if PDF-lib is loaded
    if (typeof PDFLib === 'undefined') {
        errorHandler.showError('PDF library is still loading. Please wait a moment and try again.');
        return;
    }

    // Show loading
    splitBtn.disabled = true;
    loading.classList.add('visible');

    try {
        const { PDFDocument } = PDFLib;
        const newPdf = await PDFDocument.create();

        // Sort selected pages
        const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);

        // Copy selected pages to new PDF
        for (const pageNum of sortedPages) {
            const [page] = await newPdf.copyPages(pdfDocument, [pageNum - 1]); // PDF-lib uses 0-based indexing
            newPdf.addPage(page);
        }

        // Save new PDF
        const newPdfBytes = await newPdf.save();
        const blob = new Blob([newPdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Create download link
        const link = document.createElement('a');
        link.href = url;
        link.download = `extracted-pages.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        output.innerHTML = '<p class="success">PDF extraction complete! Your file has been downloaded.</p>';
        errorHandler.clearError();

    } catch (error) {
        console.error('Error extracting pages:', error);
        errorHandler.showError('Failed to extract pages. Please try again.');
    } finally {
        // Hide loading
        splitBtn.disabled = false;
        loading.classList.remove('visible');
    }
});

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
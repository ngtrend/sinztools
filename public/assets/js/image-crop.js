const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const aspectRatioCheckbox = document.getElementById('aspectRatioCheckbox');
const cropBtn = document.getElementById('cropBtn');
const loader = document.getElementById('loader');
const downloadBtn = document.getElementById('downloadBtn');
const imageCanvas = document.getElementById('imageCanvas');
const previewCanvas = document.getElementById('previewCanvas');
const canvasContainer = document.getElementById('canvasContainer');
const errorMessage = document.getElementById('errorMessage');

// Hide loader and error by default
loader.style.display = 'none';
errorMessage.style.display = 'none';

// Initialize button state
cropBtn.disabled = true;

let originalImage = null;
let originalFile = null;
let selection = null; // {x, y, width, height}
let isDragging = false;
let isResizing = false;
let dragStart = {x: 0, y: 0};
let resizeHandle = null;
let originalAspectRatio = 1;
let scale = 1; // Scale factor for canvas sizing
let pendingDrag = false;
let dragThreshold = 5; // Minimum pixels to move before starting drag
const MIN_CROP_SIZE = 10; // Minimum crop size in pixels

const ctx = imageCanvas.getContext('2d');
const previewCtx = previewCanvas.getContext('2d');

// Helper function to get coordinates from mouse or touch events
function getEventCoords(e) {
    if (e.touches && e.touches.length > 0) {
        return {x: e.touches[0].clientX, y: e.touches[0].clientY};
    } else {
        return {x: e.clientX, y: e.clientY};
    }
}

// Initialize image selection handler
initImageUpload(dropZone, fileInput, (img, file) => {
    originalImage = img;
    originalFile = file;
    originalAspectRatio = img.width / img.height;

    // Calculate scaled canvas size
    const maxWidth = canvasContainer.offsetWidth || 800;
    scale = Math.min(maxWidth / img.width, 1);
    imageCanvas.width = img.width * scale;
    imageCanvas.height = img.height * scale;
    canvasContainer.style.width = imageCanvas.width + 'px';
    canvasContainer.style.height = imageCanvas.height + 'px';

    // Draw scaled image
    ctx.drawImage(img, 0, 0, imageCanvas.width, imageCanvas.height);

    // Set selection to full image
    selection = {x: 0, y: 0, width: img.width, height: img.height};
    drawSelection();

    // Clear preview
    previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    downloadBtn.classList.remove('visible');
    
    // Enable crop button
    cropBtn.disabled = false;
});

// Mouse and touch event handlers for selection
imageCanvas.addEventListener('mousedown', handlePointerDown);
imageCanvas.addEventListener('touchstart', handlePointerDown);

function handlePointerDown(e) {
    e.preventDefault(); // Prevent scrolling on touch
    const rect = imageCanvas.getBoundingClientRect();
    const coords = getEventCoords(e);
    const x = (coords.x - rect.left) / scale;
    const y = (coords.y - rect.top) / scale;

    // Only allow drag to move if not on a handle
    if (selection && isInsideSelection(x, y) && !isOnHandle(x, y)) {
        pendingDrag = true;
        dragStart = {x, y};
    }
}

document.addEventListener('mousemove', handlePointerMove);
document.addEventListener('touchmove', handlePointerMove);

function handlePointerMove(e) {
    e.preventDefault(); // Prevent scrolling on touch
    const rect = imageCanvas.getBoundingClientRect();
    const coords = getEventCoords(e);
    const x = (coords.x - rect.left) / scale;
    const y = (coords.y - rect.top) / scale;

    // Handle resizing if a handle is being dragged
    if (isResizing && selection && resizeHandle) {
        resizeSelection(x, y);
        drawSelection();
    } 
    // Handle pending drag threshold
    else if (pendingDrag && selection) {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance > dragThreshold) {
            isDragging = true;
            pendingDrag = false;
        }
    } 
    // Handle moving the selection
    else if (isDragging && selection) {
        const dx = x - dragStart.x;
        const dy = y - dragStart.y;
        selection.x += dx;
        selection.y += dy;
        normalizeSelection();
        dragStart = {x, y};
        drawSelection();
    }
}

document.addEventListener('mouseup', handlePointerUp);
document.addEventListener('touchend', handlePointerUp);

function handlePointerUp() {
    isDragging = false;
    isResizing = false;
    pendingDrag = false;
    resizeHandle = null;
    if (selection) {
        normalizeSelection();
        drawSelection();
    }
}

// Prevent context menu on right click
imageCanvas.addEventListener('contextmenu', (e) => e.preventDefault());

function isInsideSelection(x, y) {
    if (!selection) return false;
    return x >= selection.x && x <= selection.x + selection.width &&
           y >= selection.y && y <= selection.y + selection.height;
}

function isOnHandle(x, y) {
    if (!selection) return false;
    const handles = getHandles();
    const handleSize = 5 / scale; // Half the handle size in original coords (10px screen / 2)
    return handles.some(handle => {
        return x >= handle.x - handleSize && x <= handle.x + handleSize &&
               y >= handle.y - handleSize && y <= handle.y + handleSize;
    });
}

function getHandle(x, y) {
    const handles = getHandles();
    const handleSize = 5 / scale;
    for (let i = 0; i < handles.length; i++) {
        const handle = handles[i];
        if (x >= handle.x - handleSize && x <= handle.x + handleSize &&
            y >= handle.y - handleSize && y <= handle.y + handleSize) {
            return ['nw', 'ne', 'sw', 'se'][i];
        }
    }
    return null;
}

function getHandles() {
    if (!selection) return [];
    return [
        {x: selection.x, y: selection.y}, // nw
        {x: selection.x + selection.width, y: selection.y}, // ne
        {x: selection.x, y: selection.y + selection.height}, // sw
        {x: selection.x + selection.width, y: selection.y + selection.height} // se
    ];
}

function resizeSelection(x, y) {
    if (!selection || !resizeHandle) return;

    const dx = x - dragStart.x;
    const dy = y - dragStart.y;
    const originalSelection = {...selection};

    switch (resizeHandle) {
        case 'nw':
            selection.x += dx;
            selection.y += dy;
            selection.width -= dx;
            selection.height -= dy;
            break;
        case 'ne':
            selection.y += dy;
            selection.width += dx;
            selection.height -= dy;
            break;
        case 'sw':
            selection.x += dx;
            selection.width -= dx;
            selection.height += dy;
            break;
        case 'se':
            selection.width += dx;
            selection.height += dy;
            break;
    }

    // Maintain aspect ratio if checked
    if (aspectRatioCheckbox.checked) {
        const aspect = originalSelection.width / originalSelection.height;
        switch (resizeHandle) {
            case 'nw':
            case 'se':
                selection.height = selection.width / aspect;
                if (resizeHandle === 'nw') {
                    selection.y = originalSelection.y + originalSelection.height - selection.height;
                }
                break;
            case 'ne':
            case 'sw':
                selection.height = selection.width / aspect;
                if (resizeHandle === 'ne') {
                    selection.y = originalSelection.y + originalSelection.height - selection.height;
                }
                break;
        }
    }

    normalizeSelection();
    dragStart = {x, y};
}

function normalizeSelection() {
    if (!selection) return;

    // Ensure positive width and height
    if (selection.width < 0) {
        selection.x += selection.width;
        selection.width = -selection.width;
    }
    if (selection.height < 0) {
        selection.y += selection.height;
        selection.height = -selection.height;
    }

    // Enforce minimum size
    selection.width = Math.max(selection.width, MIN_CROP_SIZE);
    selection.height = Math.max(selection.height, MIN_CROP_SIZE);

    // Clamp to image bounds
    selection.x = Math.max(0, Math.min(selection.x, originalImage.width - selection.width));
    selection.y = Math.max(0, Math.min(selection.y, originalImage.height - selection.height));
    selection.width = Math.min(selection.width, originalImage.width - selection.x);
    selection.height = Math.min(selection.height, originalImage.height - selection.y);
}

function drawSelection() {
    // Clear previous selection
    const container = document.getElementById('canvasContainer');
    const existingSelection = container.querySelector('.crop-selection');
    if (existingSelection) existingSelection.remove();

    const existingHandles = container.querySelectorAll('.crop-handle');
    existingHandles.forEach(h => h.remove());

    if (!selection || selection.width === 0 || selection.height === 0) return;

    // Draw selection rectangle
    const selectionDiv = document.createElement('div');
    selectionDiv.className = 'crop-selection';
    selectionDiv.style.left = (selection.x * scale) + 'px';
    selectionDiv.style.top = (selection.y * scale) + 'px';
    selectionDiv.style.width = (selection.width * scale) + 'px';
    selectionDiv.style.height = (selection.height * scale) + 'px';
    selectionDiv.style.cursor = 'move';
    container.appendChild(selectionDiv);

    // Add move handler to selection box
    const startMove = (e) => {
        // Only start move if clicking on the selection box itself, not on handles
        if (e.target.classList.contains('crop-handle')) {
            return; // Let handle listener take over
        }
        e.preventDefault();
        e.stopPropagation();
        pendingDrag = true;
        const rect = imageCanvas.getBoundingClientRect();
        const coords = getEventCoords(e);
        dragStart = {
            x: (coords.x - rect.left) / scale,
            y: (coords.y - rect.top) / scale
        };
    };

    selectionDiv.addEventListener('mousedown', startMove);
    selectionDiv.addEventListener('touchstart', startMove);

    // Draw handles with event listeners
    const handles = ['nw', 'ne', 'sw', 'se'];
    handles.forEach((handleClass) => {
        const handleDiv = document.createElement('div');
        handleDiv.className = 'crop-handle ' + handleClass;
        selectionDiv.appendChild(handleDiv);

        // Add resize handle listeners
        const startResize = (e) => {
            e.preventDefault();
            e.stopPropagation();
            isResizing = true;
            resizeHandle = handleClass;
            const rect = imageCanvas.getBoundingClientRect();
            const coords = getEventCoords(e);
            dragStart = {
                x: (coords.x - rect.left) / scale,
                y: (coords.y - rect.top) / scale
            };
        };

        handleDiv.addEventListener('mousedown', startResize);
        handleDiv.addEventListener('touchstart', startResize);
    });
}

// Crop button handler
cropBtn.addEventListener('click', () => {
    if (!originalImage || !selection) {
        errorHandler.showError('Please select an image and crop area first.');
        return;
    }

    loader.style.display = 'block';
    cropBtn.disabled = true;

    // Perform crop
    setTimeout(() => {
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        croppedCanvas.width = selection.width;
        croppedCanvas.height = selection.height;
        croppedCtx.drawImage(originalImage,
            selection.x, selection.y, selection.width, selection.height,
            0, 0, selection.width, selection.height);

        // Set preview
        previewCanvas.width = selection.width;
        previewCanvas.height = selection.height;
        previewCtx.drawImage(croppedCanvas, 0, 0);

        // Prepare download
        croppedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cropped-image.' + getExtension(originalFile.type);
                a.click();
            };
            downloadBtn.classList.add('visible');
            loader.style.display = 'none';
            cropBtn.disabled = false;
        }, originalFile.type);
    }, 100); // Small delay for UI feedback
});

function getExtension(mimeType) {
    switch (mimeType) {
        case 'image/png': return 'png';
        case 'image/jpeg': return 'jpg';
        case 'image/webp': return 'webp';
        default: return 'png';
    }
}
// Get DOM elements
const fileInput = document.getElementById('fileInput');
const compressionSelect = document.getElementById('compressionSelect');
const compressBtn = document.getElementById('compressBtn');
const output = document.getElementById('output');

// Update label text when file is selected
fileInput.addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'Choose File';
    document.getElementById('fileInputLabel').textContent = fileName;
});

// Add event listener to compress button
compressBtn.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (!file) {
        output.innerHTML = '<p>Please select an image file.</p>';
        return;
    }

    const quality = parseFloat(compressionSelect.value);
    const originalSize = file.size;

    // Create image element
    const img = new Image();
    img.onload = function() {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image to canvas
        ctx.drawImage(img, 0, 0);

        // Compress using toBlob with quality
        canvas.toBlob(function(blob) {
            const compressedSize = blob.size;
            const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `compressed_${file.name}`;
            a.textContent = 'Download Compressed Image';
            a.style.display = 'inline-block';
            a.style.padding = '10px 20px';
            a.style.backgroundColor = '#28a745';
            a.style.color = 'white';
            a.style.textDecoration = 'none';
            a.style.borderRadius = '5px';

            // Display results
            output.innerHTML = `
                <p>Original size: ${(originalSize / 1024).toFixed(1)} KB</p>
                <p>Compressed size: ${(compressedSize / 1024).toFixed(1)} KB</p>
                <p>Space saved: ${savings}%</p>
            `;
            output.appendChild(a);
        }, file.type, quality); // Use original mime type, apply quality
    };
    img.src = URL.createObjectURL(file);
});
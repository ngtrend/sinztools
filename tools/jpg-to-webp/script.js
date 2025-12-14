// Get DOM elements
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const output = document.getElementById('output');

// Add event listener to convert button
convertBtn.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (!file) {
        output.innerHTML = '<p>Please select a JPG file.</p>';
        return;
    }

    // Check if it's a JPG
    if (!file.type.startsWith('image/jpeg')) {
        output.innerHTML = '<p>Please select a valid JPG file.</p>';
        return;
    }

    // Check if WEBP is supported
    if (!document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')) {
        output.innerHTML = '<p>WEBP format is not supported in this browser.</p>';
        return;
    }

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

            // Display result
            output.innerHTML = '<p>Conversion complete!</p>';
            output.appendChild(a);
        }, 'image/webp'); // Convert to WEBP
    };
    img.src = URL.createObjectURL(file);
});
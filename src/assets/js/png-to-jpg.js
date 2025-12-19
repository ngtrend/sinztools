// Get DOM elements
const fileInput = document.getElementById('fileInput');
const convertBtn = document.getElementById('convertBtn');
const output = document.getElementById('output');

// Update label text when file is selected
fileInput.addEventListener('change', function() {
    const fileName = this.files[0] ? this.files[0].name : 'Choose File';
    document.getElementById('fileInputLabel').textContent = fileName;
});

// Add event listener to convert button
convertBtn.addEventListener('click', function() {
    const file = fileInput.files[0];
    if (!file) {
        output.innerHTML = '<p>Please select a PNG file.</p>';
        return;
    }

    // Check if it's a PNG
    if (!file.type.startsWith('image/png')) {
        output.innerHTML = '<p>Please select a valid PNG file.</p>';
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

        // Convert to JPG using toBlob
        canvas.toBlob(function(blob) {
            // Create download link
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'converted.jpg';
            a.textContent = 'Download JPG Image';
            a.style.display = 'inline-block';
            a.style.padding = '10px 20px';
            a.style.backgroundColor = '#28a745';
            a.style.color = 'white';
            a.style.textDecoration = 'none';
            a.style.borderRadius = '5px';

            // Display result
            output.innerHTML = '<p>Conversion complete!</p>';
            output.appendChild(a);
        }, 'image/jpeg'); // Convert to JPG
    };
    img.src = URL.createObjectURL(file);
});
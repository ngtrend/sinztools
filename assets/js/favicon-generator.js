// Favicon Generator Script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('faviconForm');
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateBtn');
    const output = document.getElementById('output');

    generateBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (!file) {
            errorHandler.showError('Please select an image file.');
            return;
        }

        output.innerHTML = '<p>Generating favicons...</p>';

        try {
            const favicons = await generateFavicons(file);
            displayFavicons(favicons);
        } catch (error) {
            output.innerHTML = '<p>Error generating favicons: ' + error.message + '</p>';
        }
    });

    async function generateFavicons(file) {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        return new Promise((resolve, reject) => {
            img.onload = async function() {
                const sizes = [16, 32, 48, 64, 128, 256];
                const favicons = [];

                for (const size of sizes) {
                    canvas.width = size;
                    canvas.height = size;
                    ctx.drawImage(img, 0, 0, size, size);

                    const blob = await new Promise(resolveBlob => {
                        canvas.toBlob(resolveBlob, 'image/png');
                    });

                    favicons.push({
                        size: size,
                        blob: blob,
                        url: URL.createObjectURL(blob)
                    });
                }

                resolve(favicons);
            };

            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    function displayFavicons(favicons) {
        output.innerHTML = '<h3>Generated Favicons</h3>';
        const container = document.createElement('div');
        container.className = 'favicon-grid';

        favicons.forEach(favicon => {
            const item = document.createElement('div');
            item.className = 'favicon-item';
            item.innerHTML = `
                <img src="${favicon.url}" alt="${favicon.size}x${favicon.size} favicon" width="${favicon.size}" height="${favicon.size}">
                <p>${favicon.size}x${favicon.size}</p>
                <a href="${favicon.url}" download="favicon-${favicon.size}x${favicon.size}.png">Download</a>
            `;
            container.appendChild(item);
        });

        // Add download all as zip option (simplified, just individual downloads for now)
        const downloadAll = document.createElement('div');
        downloadAll.innerHTML = '<p><strong>Tip:</strong> Right-click and save each favicon, or use the downloads above.</p>';
        container.appendChild(downloadAll);

        output.appendChild(container);
    }
});
// Favicon Generator Script
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('faviconForm');
    const fileInput = document.getElementById('fileInput');
    const generateBtn = document.getElementById('generateBtn');
    const output = document.getElementById('output');

    // Update label text when file is selected
    fileInput.addEventListener('change', function() {
        const fileName = fileInput.files[0] ? fileInput.files[0].name : 'Choose File';
        document.getElementById('fileInputLabel').textContent = fileName;
    });

    generateBtn.addEventListener('click', async function() {
        const file = fileInput.files[0];
        if (!file) {
            alert('Please select an image file.');
            return;
        }

        output.innerHTML = '<p>Generating favicons...</p>';

        try {
            const result = await generateFavicons(file);
            displayFavicons(result.favicons, result.icoUrl, result.manifestUrl, result.zipUrl);
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
                const sizes = [
                    { size: 16, name: 'favicon-16x16.png' },
                    { size: 32, name: 'favicon-32x32.png' },
                    { size: 180, name: 'apple-touch-icon.png' },
                    { size: 192, name: 'android-chrome-192x192.png' },
                    { size: 512, name: 'android-chrome-512x512.png' }
                ];
                const favicons = [];

                for (const item of sizes) {
                    canvas.width = item.size;
                    canvas.height = item.size;
                    ctx.drawImage(img, 0, 0, item.size, item.size);

                    const blob = await new Promise(resolveBlob => {
                        canvas.toBlob(resolveBlob, 'image/png');
                    });

                    favicons.push({
                        name: item.name,
                        size: item.size,
                        blob: blob,
                        url: URL.createObjectURL(blob)
                    });
                }

                // Generate favicon.ico (using 32x32 PNG as ICO)
                const icoBlob = favicons.find(f => f.size === 32).blob;
                const icoUrl = URL.createObjectURL(icoBlob);

                // Generate site.webmanifest
                const manifestContent = `{
  "name": "Your Website",
  "short_name": "Your Site",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone"
}`;
                const manifestBlob = new Blob([manifestContent], { type: 'application/manifest+json' });
                const manifestUrl = URL.createObjectURL(manifestBlob);

                // Create ZIP
                const zip = new JSZip();
                favicons.forEach(f => {
                    zip.file(f.name, f.blob);
                });
                zip.file('favicon.ico', icoBlob);
                zip.file('site.webmanifest', manifestBlob);

                const zipBlob = await zip.generateAsync({type: "blob"});
                const zipUrl = URL.createObjectURL(zipBlob);

                resolve({ favicons, icoUrl, manifestUrl, zipUrl });
            };

            img.onerror = reject;
            img.src = URL.createObjectURL(file);
        });
    }

    function displayFavicons(favicons, icoUrl, manifestUrl, zipUrl) {
        output.innerHTML = '<h3>Generated Favicons</h3>';
        const container = document.createElement('div');
        container.className = 'favicon-grid';

        // Download All ZIP button
        const downloadAll = document.createElement('div');
        downloadAll.innerHTML = `<p><a href="${zipUrl}" download="favicons.zip" class="download-all">Download All as ZIP</a></p>`;
        container.appendChild(downloadAll);

        // Special files
        const specialFiles = [
            { name: 'favicon.ico', url: icoUrl },
            { name: 'site.webmanifest', url: manifestUrl }
        ];

        specialFiles.forEach(file => {
            const item = document.createElement('div');
            item.className = 'favicon-item';
            item.style.cssText = 'border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 4px;';
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span>${file.name}</span>
                    <a href="${file.url}" download="${file.name}" style="margin-left: auto;">Download</a>
                </div>
            `;
            container.appendChild(item);
        });

        favicons.forEach(favicon => {
            const item = document.createElement('div');
            item.className = 'favicon-item';
            item.style.cssText = 'border: 1px solid #ddd; padding: 10px; margin: 5px 0; border-radius: 4px;';
            item.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="${favicon.url}" alt="${favicon.name}" width="${favicon.size}" height="${favicon.size}" style="flex-shrink: 0;">
                    <span>${favicon.name}</span>
                    <a href="${favicon.url}" download="${favicon.name}" style="margin-left: auto;">Download</a>
                </div>
            `;
            container.appendChild(item);
        });

        output.appendChild(container);
    }
});
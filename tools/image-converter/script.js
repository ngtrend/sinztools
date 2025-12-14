document.getElementById('convertBtn').addEventListener('click', function () {
	const fileInput = document.getElementById('fileInput');
	const formatSelect = document.getElementById('formatSelect');
	const output = document.getElementById('output');

	const file = fileInput.files[0];
	if (!file) {
		output.innerHTML = '<p>Please select an image file.</p>';
		return;
	}

	const format = formatSelect.value;
	const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;

	// Check if WEBP is supported
	if (format === 'webp' && !document.createElement('canvas').toDataURL('image/webp').startsWith('data:image/webp')) {
		output.innerHTML = '<p>WEBP format is not supported in this browser.</p>';
		return;
	}

	const img = new Image();
	img.onload = function () {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = img.width;
		canvas.height = img.height;
		ctx.drawImage(img, 0, 0);

		canvas.toBlob(function (blob) {
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `converted.${format}`;
			a.textContent = 'Download Converted Image';
			a.style.display = 'inline-block';
			a.style.padding = '10px 20px';
			a.style.backgroundColor = '#28a745';
			a.style.color = 'white';
			a.style.textDecoration = 'none';
			a.style.borderRadius = '5px';
			output.innerHTML = '<p>Conversion complete!</p>';
			output.appendChild(a);
		}, mimeType);
	};
	img.src = URL.createObjectURL(file);
});
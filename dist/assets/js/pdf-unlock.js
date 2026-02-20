const fileInput = document.getElementById('fileInput');
const dropZone = document.getElementById('dropZone');
const pdfInfo = document.getElementById('pdfInfo');
const pdfName = document.getElementById('pdfName');
const pdfSize = document.getElementById('pdfSize');
const unlockForm = document.getElementById('unlockForm');
const pdfPassword = document.getElementById('pdfPassword');
const togglePw = document.getElementById('togglePw');
const unlockBtn = document.getElementById('unlockBtn');
const loading = document.getElementById('loading');
const output = document.getElementById('output');

let currentFile = null;

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
	e.preventDefault();
	dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', (e) => {
	const rect = dropZone.getBoundingClientRect();
	if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
		dropZone.classList.remove('dragover');
	}
});

dropZone.addEventListener('drop', (e) => {
	e.preventDefault();
	dropZone.classList.remove('dragover');
	const file = e.dataTransfer.files[0];
	if (file) handleFile(file);
});

fileInput.addEventListener('change', (e) => {
	const file = e.target.files[0];
	if (file) handleFile(file);
});

function handleFile(file) {
	if (file.type !== 'application/pdf') {
		errorHandler.showError('Please select a valid PDF file.');
		return;
	}

	currentFile = file;
	output.innerHTML = '';
	errorHandler.clearError();

	pdfName.textContent = file.name;
	pdfSize.textContent = formatFileSize(file.size);
	pdfInfo.style.display = 'block';
	unlockForm.style.display = 'block';
	pdfPassword.value = '';
	pdfPassword.focus();
}

// Show/hide password toggle
togglePw.addEventListener('click', () => {
	if (pdfPassword.type === 'password') {
		pdfPassword.type = 'text';
		togglePw.setAttribute('aria-label', 'Hide password');
	} else {
		pdfPassword.type = 'password';
		togglePw.setAttribute('aria-label', 'Show password');
	}
});

// Allow pressing Enter in password field to trigger unlock
pdfPassword.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') unlockBtn.click();
});

unlockBtn.addEventListener('click', async () => {
	if (!currentFile) {
		errorHandler.showError('Please select a PDF file first.');
		return;
	}

	const password = pdfPassword.value;
	if (!password) {
		errorHandler.showError('Please enter the PDF password.');
		pdfPassword.focus();
		return;
	}

	unlockBtn.disabled = true;
	loading.classList.add('visible');
	output.innerHTML = '';
	errorHandler.clearError();

	try {
		const buffer = await currentFile.arrayBuffer();

		const { PDFDocument } = PDFLib;
		const pdfDoc = await PDFDocument.load(buffer, { password });

		const unlockedBytes = await pdfDoc.save();
		const blob = new Blob([unlockedBytes], { type: 'application/pdf' });
		const url = URL.createObjectURL(blob);

		const baseName = currentFile.name.replace(/\.pdf$/i, '');
		const downloadName = `${baseName}_unlocked.pdf`;

		output.innerHTML = `
			<div class="success-message" style="margin-top:20px;">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
				</svg>
				PDF unlocked successfully!
			</div>
			<a href="${url}" download="${downloadName}" class="download-btn" style="margin-top:12px;display:inline-flex;align-items:center;gap:8px;">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18" aria-hidden="true">
					<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
				</svg>
				Download Unlocked PDF
			</a>
		`;
	} catch (err) {
		if (err.message && (err.message.includes('password') || err.message.includes('encrypt') || err.message.includes('decrypt'))) {
			errorHandler.showError('Incorrect password. Please check the password and try again.');
		} else {
			errorHandler.showError('Failed to unlock PDF. Make sure the file is a valid password-protected PDF.');
		}
	} finally {
		unlockBtn.disabled = false;
		loading.classList.remove('visible');
	}
});

function formatFileSize(bytes) {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB', 'GB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Video to GIF Converter - Browser-based using Canvas API + gif.js
// Optimized for speed and quality, works everywhere without special headers

(function () {
	'use strict';

	const fileInput = document.getElementById('fileInput');
	const dropZone = document.getElementById('dropZone');
	const convertBtn = document.getElementById('convertBtn');
	const output = document.getElementById('output');
	const fileInfo = document.getElementById('fileInfo');
	const fileName = document.getElementById('fileName');
	const fileSize = document.getElementById('fileSize');
	const videoDuration = document.getElementById('videoDuration');
	const controlsSection = document.getElementById('controlsSection');
	const progressContainer = document.getElementById('progressContainer');
	const progressFill = document.getElementById('progressFill');
	const progressText = document.getElementById('progressText');
	const cancelBtn = document.getElementById('cancelBtn');

	// Controls
	const presetButtons = document.querySelectorAll('.preset-btn');

	if (!fileInput || !dropZone || !convertBtn) {
		return;
	}

	let currentFile = null;
	let videoMetadata = null;
	let gif = null;
	let isConverting = false;

	const MAX_DURATION = 15; // Max seconds for GIF conversion
	const RECOMMENDED_DURATION = 10;

	// Quality presets (quality: lower = better, 1-30 range)
	const presets = {
		small: { fps: 8, width: 320, quality: 10 },
		balanced: { fps: 10, width: 480, quality: 15 },
		high: { fps: 15, width: 720, quality: 20 }
	};

	let currentPreset = 'balanced';

	// Helper functions
	function formatFileSize(bytes) {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
	}

	function formatTime(seconds) {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	function setProgress(percent, text) {
		progressFill.style.width = percent + '%';
		progressText.textContent = text || `${percent}%`;
	}

	function showError(message) {
		output.innerHTML = `
			<div class="error-message" style="padding: 15px; background: #fee; border: 1px solid #fcc; border-radius: 4px; color: #c33;">
				<strong>Error:</strong> ${message}
			</div>
		`;
	}

	function showSuccess(blob, originalSize) {
		const gifSize = blob.size;
		const url = URL.createObjectURL(blob);

		output.innerHTML = `
			<div class="success-message" style="padding: 15px; background: #efe; border: 1px solid #cfc; border-radius: 4px; margin-bottom: 15px;">
				<strong>✓ Conversion complete!</strong><br>
				GIF size: ${formatFileSize(gifSize)} (Original: ${formatFileSize(originalSize)})
			</div>
			<div style="text-align: center;">
				<img src="${url}" alt="Generated GIF" style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
				<div style="margin-top: 15px;">
					<a href="${url}" download="converted.gif" class="download-btn" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: 600;">
						Download GIF
					</a>
				</div>
			</div>
		`;
	}

	// Load video metadata
	function loadVideoMetadata(file) {
		return new Promise((resolve, reject) => {
			const video = document.createElement('video');
			video.preload = 'metadata';
			video.src = URL.createObjectURL(file);

			video.onloadedmetadata = () => {
				URL.revokeObjectURL(video.src);
				resolve({
					duration: video.duration,
					width: video.videoWidth,
					height: video.videoHeight
				});
			};

			video.onerror = () => {
				URL.revokeObjectURL(video.src);
				reject(new Error('Failed to load video metadata'));
			};
		});
	}

	// Extract frames from video using Canvas
	async function extractFrames(video, startTime, duration, fps, targetWidth) {
		return new Promise((resolve, reject) => {
			const frames = [];
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d', { willReadFrequently: true });

			// Calculate dimensions maintaining aspect ratio
			const aspectRatio = video.videoHeight / video.videoWidth;
			canvas.width = targetWidth;
			canvas.height = Math.round(targetWidth * aspectRatio);

			const interval = 1 / fps;
			const endTime = Math.min(startTime + duration, video.duration);
			let currentTime = startTime;
			let frameCount = 0;
			const totalFrames = Math.ceil(duration * fps);

			video.currentTime = startTime;

			const captureFrame = () => {
				try {
					// Draw current frame
					ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
					
					// Get image data
					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					frames.push(imageData);

					frameCount++;
					setProgress(Math.round((frameCount / totalFrames) * 50), `Extracting frames... ${frameCount}/${totalFrames}`);

					currentTime += interval;

					if (currentTime < endTime) {
						video.currentTime = currentTime;
					} else {
						resolve(frames);
					}
				} catch (error) {
					reject(error);
				}
			};

			video.onseeked = captureFrame;

			video.onerror = () => reject(new Error('Video playback error'));
		});
	}

	// Convert frames to GIF using gif.js
	async function createGIF(frames, fps, width, height, quality) {
		return new Promise((resolve, reject) => {
			// Initialize gif.js
			gif = new GIF({
				workers: 2,
				quality: quality, // Lower is better (1-30)
				width: width,
				height: height,
				workerScript: '/assets/js/gif/gif.worker.js',
				transparent: null,
				dither: 'FloydSteinberg' // Better quality dithering
			});

			// Add frames
			const delay = Math.round(1000 / fps);
			frames.forEach((frame, index) => {
				gif.addFrame(frame, { delay: delay, copy: true });
				
				if ((index + 1) % 10 === 0) {
					setProgress(50 + Math.round((index / frames.length) * 25), `Adding frames... ${index + 1}/${frames.length}`);
				}
			});

			// Progress during encoding
			gif.on('progress', (p) => {
				setProgress(75 + Math.round(p * 25), `Encoding GIF... ${Math.round(p * 100)}%`);
			});

			// Handle completion
			gif.on('finished', (blob) => {
				resolve(blob);
			});

			// Handle error
			gif.on('abort', () => {
				reject(new Error('GIF creation aborted'));
			});

			// Start rendering
			gif.render();
		});
	}

	// Main conversion function
	async function convertToGIF() {
		if (!currentFile || isConverting) return;

		isConverting = true;
		convertBtn.disabled = true;
		cancelBtn.style.display = 'inline-block';
		output.innerHTML = '';
		progressContainer.style.display = 'block';
		setProgress(0, 'Starting conversion...');

		try {
			// Get settings from current preset
			const settings = presets[currentPreset];
			const fps = settings.fps;
			const targetWidth = settings.width;
			const quality = settings.quality;

			// Use full video duration up to MAX_DURATION
			const startTime = 0;
			const duration = Math.min(videoMetadata.duration, MAX_DURATION);

			// Create video element for frame extraction
			const video = document.createElement('video');
			video.src = URL.createObjectURL(currentFile);
			video.muted = true;

			// Wait for video to load
			await new Promise((resolve, reject) => {
				video.onloadeddata = resolve;
				video.onerror = () => reject(new Error('Failed to load video'));
				video.load();
			});

			// Extract frames
			setProgress(5, 'Extracting frames...');
			const frames = await extractFrames(video, startTime, duration, fps, targetWidth);

			// Clean up video
			URL.revokeObjectURL(video.src);

			if (!isConverting) {
				throw new Error('Conversion cancelled');
			}

			// Create GIF
			setProgress(50, 'Creating GIF...');
			const aspectRatio = video.videoHeight / video.videoWidth;
			const targetHeight = Math.round(targetWidth * aspectRatio);
			const blob = await createGIF(frames, fps, targetWidth, targetHeight, quality);

			if (!isConverting) {
				throw new Error('Conversion cancelled');
			}

			setProgress(100, 'Complete!');
			showSuccess(blob, currentFile.size);

		} catch (error) {
			console.error('Conversion error:', error);
			showError(error.message || 'Failed to convert video to GIF');
		} finally {
			isConverting = false;
			convertBtn.disabled = false;
			cancelBtn.style.display = 'none';
			setTimeout(() => {
				progressContainer.style.display = 'none';
			}, 2000);
		}
	}

	// Cancel conversion
	function cancelConversion() {
		if (gif) {
			gif.abort();
		}
		isConverting = false;
		convertBtn.disabled = false;
		cancelBtn.style.display = 'none';
		progressContainer.style.display = 'none';
		showError('Conversion cancelled by user');
	}

	// Handle file selection
	async function handleFileSelect(file) {
		if (!file || !file.type.startsWith('video/')) {
			showError('Please select a valid video file');
			return;
		}

		currentFile = file;

		// Show file info
		fileName.textContent = file.name;
		fileSize.textContent = formatFileSize(file.size);
		fileInfo.style.display = 'block';

		try {
			// Load metadata
			videoMetadata = await loadVideoMetadata(file);

			// Update duration info
			const duration = Math.min(videoMetadata.duration, MAX_DURATION);
			videoDuration.innerHTML = `
				<strong>Duration:</strong> ${formatTime(videoMetadata.duration)} | 
				<strong>Resolution:</strong> ${videoMetadata.width}x${videoMetadata.height}
			`;

			// Show controls and enable button
			controlsSection.style.display = 'block';
			convertBtn.style.display = 'block';
			convertBtn.disabled = false;

			// Show warning for long videos
			if (videoMetadata.duration > MAX_DURATION) {
				videoDuration.innerHTML += `<br><span style="color: #ff6b6b;">⚠️ Video will be converted up to ${MAX_DURATION}s</span>`;
			}

		} catch (error) {
			showError('Failed to load video: ' + error.message);
		}
	}

	// Preset buttons
	presetButtons.forEach(button => {
		button.addEventListener('click', () => {
			const preset = button.dataset.preset;
			currentPreset = preset;

			// Update active state
			presetButtons.forEach(btn => btn.classList.remove('active'));
			button.classList.add('active');
		});
	});

	// File input change
	fileInput.addEventListener('change', (e) => {
		if (e.target.files.length > 0) {
			handleFileSelect(e.target.files[0]);
		}
	});

	// Drop zone events
	dropZone.addEventListener('click', (e) => {
		// Prevent double triggering if clicking on label
		if (e.target.tagName === 'LABEL') return;
		
		// Reset file input to allow selecting the same file again
		fileInput.value = '';
		fileInput.click();
	});

	dropZone.addEventListener('dragover', (e) => {
		e.preventDefault();
		dropZone.classList.add('drag-over');
	});

	dropZone.addEventListener('dragleave', () => {
		dropZone.classList.remove('drag-over');
	});

	dropZone.addEventListener('drop', (e) => {
		e.preventDefault();
		dropZone.classList.remove('drag-over');
		if (e.dataTransfer.files.length > 0) {
			// Reset file input to allow selecting same file again
			fileInput.value = '';
			handleFileSelect(e.dataTransfer.files[0]);
		}
	});

	// Convert button
	convertBtn.addEventListener('click', convertToGIF);

	// Cancel button
	cancelBtn.addEventListener('click', cancelConversion);

})();

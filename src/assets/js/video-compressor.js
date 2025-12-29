// Video Compressor - Fast WebM Compression
// Uses browser's native MediaRecorder for speed and responsiveness

(function () {
    'use strict';

    const fileInput = document.getElementById('fileInput');
    const dropZone = document.getElementById('dropZone');
    const compressBtn = document.getElementById('compressBtn');
    const output = document.getElementById('output');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const controlsSection = document.getElementById('controlsSection');
    const progressContainer = document.getElementById('progressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const cancelBtn = document.getElementById('cancelBtn');
    const browserWarning = document.getElementById('browserWarning');
    const presetButtons = document.querySelectorAll('.preset-btn');

    if (!fileInput || !dropZone || !compressBtn) {
        return;
    }

    let currentFile = null;
    let currentPreset = 'balanced';
    let abortController = null;
    let mediaRecorder = null;
    let videoElement = null;
    let canvasElement = null;
    let audioContext = null;
    let mediaStream = null;
    let isCompressing = false;

    // Quality presets (bitrate in bps)
    const presets = {
        low: { videoBitrate: 500000, audioBitrate: 64000, label: 'Low Quality' },
        balanced: { videoBitrate: 2000000, audioBitrate: 128000, label: 'Balanced' },
        high: { videoBitrate: 5000000, audioBitrate: 192000, label: 'High Quality' }
    };

    function setProgress(percent, label) {
        const safe = Math.min(100, Math.max(0, Math.round(percent)));
        progressFill.style.width = `${safe}%`;
        progressText.textContent = label || `Working... ${safe}%`;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    function resetUI() {
        compressBtn.disabled = !currentFile;
        progressContainer.style.display = 'none';
        progressFill.style.width = '0%';
        progressText.textContent = 'Preparing...';
    }

    function cleanup() {
        try {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
            }
            mediaRecorder = null;
        } catch (e) { /* ignore */ }

        try {
            if (videoElement) {
                videoElement.pause();
                videoElement.src = '';
                if (videoElement.parentNode) {
                    videoElement.parentNode.removeChild(videoElement);
                }
            }
            videoElement = null;
        } catch (e) { /* ignore */ }

        try {
            if (canvasElement && canvasElement.parentNode) {
                canvasElement.parentNode.removeChild(canvasElement);
            }
            canvasElement = null;
        } catch (e) { /* ignore */ }

        try {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            mediaStream = null;
        } catch (e) { /* ignore */ }

        try {
            if (audioContext) {
                audioContext.close();
            }
            audioContext = null;
        } catch (e) { /* ignore */ }
    }

    function checkBrowserCompatibility() {
        return typeof MediaRecorder !== 'undefined';
    }

    async function compress() {
        if (!currentFile) {
            errorHandler?.showError?.('Please select a video file.');
            return;
        }

        if (!checkBrowserCompatibility()) {
            browserWarning.style.display = 'block';
            errorHandler?.showError?.('Your browser does not support video compression. Please use Chrome, Edge, or Firefox.');
            return;
        }

        output.innerHTML = '';
        errorHandler?.clearError?.();
        compressBtn.disabled = true;
        progressContainer.style.display = 'block';
        setProgress(0, 'Loading video...');
        isCompressing = true;

        abortController = new AbortController();
        cancelBtn.onclick = () => {
            if (abortController) {
                abortController.abort();
                cleanup();
                errorHandler?.showError?.('Compression cancelled.');
                resetUI();
            }
        };

        const chunks = [];

        try {
            // Create hidden video element
            const videoUrl = URL.createObjectURL(currentFile);
            videoElement = document.createElement('video');
            videoElement.src = videoUrl;
            videoElement.muted = true;
            videoElement.playsInline = true;
            videoElement.style.position = 'fixed';
            videoElement.style.left = '-9999px';
            videoElement.style.opacity = '0';
            document.body.appendChild(videoElement);

            await new Promise((resolve, reject) => {
                videoElement.onloadedmetadata = () => resolve();
                videoElement.onerror = () => reject(new Error('Failed to load video'));
            });

            const duration = videoElement.duration;
            // Use higher bitrate for better quality - 4 Mbps video
            const targetBitrate = 4000000;

            // Get actual video dimensions (considering rotation)
            const videoWidth = videoElement.videoWidth;
            const videoHeight = videoElement.videoHeight;

            // Create canvas to handle rotation properly
            canvasElement = document.createElement('canvas');
            canvasElement.width = videoWidth;
            canvasElement.height = videoHeight;
            canvasElement.style.position = 'fixed';
            canvasElement.style.left = '-9999px';
            document.body.appendChild(canvasElement);

            const ctx = canvasElement.getContext('2d', { alpha: false });

            // Start video playback first
            videoElement.playbackRate = 1.0; // Ensure normal speed
            await videoElement.play();

            // Draw video frames to canvas with guaranteed frame rate
            let animationFrame;
            
            function drawFrame() {
                if (!videoElement || videoElement.paused || videoElement.ended) {
                    return;
                }
                
                // Draw current frame
                ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                animationFrame = requestAnimationFrame(drawFrame);
            }
            
            // Wait for first frame to be drawn
            await new Promise(resolve => {
                const checkFrame = () => {
                    ctx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
                    if (videoElement.currentTime > 0) {
                        resolve();
                        animationFrame = requestAnimationFrame(drawFrame);
                    } else {
                        requestAnimationFrame(checkFrame);
                    }
                };
                checkFrame();
            });

            // Capture stream from canvas instead of video
            const captureStream = canvasElement.captureStream(30); // 30 fps

            // Add audio track from original video if present
            const videoStream = videoElement.captureStream ? videoElement.captureStream() : videoElement.mozCaptureStream();
            const audioTracks = videoStream.getAudioTracks();
            if (audioTracks.length > 0) {
                audioTracks.forEach(track => captureStream.addTrack(track));
            }

            mediaStream = captureStream;

            // Check for WebM support
            const mimeTypes = [
                'video/webm;codecs=vp9,opus',
                'video/webm;codecs=vp8,opus',
                'video/webm'
            ];

            let selectedMime = '';
            for (const mime of mimeTypes) {
                if (MediaRecorder.isTypeSupported(mime)) {
                    selectedMime = mime;
                    break;
                }
            }

            if (!selectedMime) {
                throw new Error('WebM recording not supported in this browser');
            }

            // Get bitrates from current preset
            const presetSettings = presets[currentPreset];
            const options = {
                mimeType: selectedMime,
                videoBitsPerSecond: presetSettings.videoBitrate
            };

            if (mediaStream.getAudioTracks().length > 0) {
                options.audioBitsPerSecond = presetSettings.audioBitrate;
            }

            mediaRecorder = new MediaRecorder(mediaStream, options);

            mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            const recordingDone = new Promise((resolve, reject) => {
                mediaRecorder.onstop = () => resolve();
                mediaRecorder.onerror = () => reject(new Error('Recording failed'));
            });

            setProgress(0, 'Compressing... 0%');
            // Restart video from beginning for recording
            videoElement.currentTime = 0;
            videoElement.playbackRate = 1.0;
            await videoElement.play();
            mediaRecorder.start();
            
            // Request data periodically to ensure smooth encoding
            const dataInterval = setInterval(() => {
                if (mediaRecorder && mediaRecorder.state === 'recording') {
                    mediaRecorder.requestData();
                }
            }, 500);
            
            // Monitor video progress to detect stalls
            let lastTime = videoElement.currentTime;
            let stallCount = 0;
            const stallCheck = setInterval(() => {
                if (videoElement.currentTime === lastTime && !videoElement.ended) {
                    stallCount++;
                    if (stallCount > 3) {
                        // Video seems stuck, force a small seek to unstick it
                        videoElement.currentTime = videoElement.currentTime + 0.01;
                    }
                } else {
                    stallCount = 0;
                }
                lastTime = videoElement.currentTime;
            }, 500);

            // Update progress based on playback time
            const progressInterval = setInterval(() => {
                if (videoElement && duration > 0) {
                    const percent = (videoElement.currentTime / duration) * 100;
                    setProgress(percent, `Compressing... ${Math.min(99, Math.round(percent))}%`);
                }
            }, 200);

            const videoEnded = new Promise((resolve) => {
                videoElement.onended = () => {
                    clearInterval(progressInterval);
                    clearInterval(dataInterval);
                    clearInterval(stallCheck);
                    if (animationFrame) {
                        cancelAnimationFrame(animationFrame);
                    }
                    // Wait to ensure all final frames are captured
                    setTimeout(resolve, 2000);
                };
            });

            await Promise.race([
                videoEnded,
                new Promise((_, reject) => {
                    abortController.signal.addEventListener('abort', () => {
                        clearInterval(dataInterval);
                        clearInterval(stallCheck);
                        reject(new Error('Cancelled'));
                    });
                })
            ]);

            setProgress(100, 'Finalizing...');
            
            // Request final data and stop
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.requestData();
            }
            mediaRecorder.stop();
            
            // Wait for final data chunks to be written
            await recordingDone;
            await new Promise(resolve => setTimeout(resolve, 500));

            const blob = new Blob(chunks, { type: selectedMime });
            const downloadUrl = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = downloadUrl;
            const baseName = currentFile.name.replace(/\.[^/.]+$/, '');
            a.download = `${baseName}_compressed.webm`;
            a.textContent = 'Download Compressed Video (WebM)';
            a.style.display = 'inline-block';
            a.style.padding = '10px 20px';
            a.style.backgroundColor = '#28a745';
            a.style.color = 'white';
            a.style.textDecoration = 'none';
            a.style.borderRadius = '5px';

            const originalSize = currentFile.size;
            const compressedSize = blob.size;
            const savings = originalSize > 0 ? ((originalSize - compressedSize) / originalSize * 100).toFixed(1) : '0.0';

            output.innerHTML = `
                <div class="success-message" style="padding: 15px; background: #efe; border: 1px solid #cfc; border-radius: 4px; margin-bottom: 15px;">
                    <strong>✓ Compression complete!</strong><br>
                    Compressed size: ${formatFileSize(compressedSize)} (Original: ${formatFileSize(originalSize)})<br>
                    Space saved: ${savings}%
                </div>
                <div style="text-align: center;">
                    <video controls style="max-width: 100%; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" src="${downloadUrl}"></video>
                    <div style="margin-top: 15px;">
                        <a href="${downloadUrl}" download="${baseName}_compressed.webm" class="download-btn" style="display: inline-block; padding: 12px 24px; background: #007bff; color: white; text-decoration: none; border-radius: 4px; font-weight: 600;">
                            Download Video
                        </a>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 10px;">Output format: WebM (plays in all modern browsers)</p>
                </div>
            `;

            progressContainer.style.display = 'none';
            URL.revokeObjectURL(videoUrl);

        } catch (error) {
            console.error('Compression error:', error);
            const errorMessage = error?.message || 'Unknown error';

            if (errorMessage.includes('Cancelled') || errorMessage.includes('cancelled')) {
                errorHandler?.showError?.('Compression cancelled.');
            } else {
                errorHandler?.showError?.(`Compression failed: ${errorMessage}`);
            }
        } finally {
            cleanup();
            abortController = null;
            isCompressing = false;
            resetUI();
        }
    }

    function setFile(file) {
        if (!file || !file.type || !file.type.startsWith('video/')) {
            currentFile = null;
            fileInfo.style.display = 'none';
            compressBtn.disabled = true;
            errorHandler?.showError?.('Please select a valid video file.');
            return;
        }
        currentFile = file;
        fileInfo.style.display = 'block';
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        controlsSection.style.display = 'block';
        compressBtn.style.display = 'block';
        compressBtn.disabled = false;
        output.innerHTML = '';
        errorHandler?.clearError?.();
    }

    function initUpload() {
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', (e) => {
            const rect = dropZone.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                dropZone.classList.remove('dragover');
            }
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files && files.length > 0) setFile(files[0]);
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            if (file) setFile(file);
        });
    }

    function init() {
        if (!checkBrowserCompatibility()) {
            browserWarning.style.display = 'block';
        }
        resetUI();
        initUpload();
        compressBtn.addEventListener('click', compress);
        
        // Preset button listeners
        presetButtons.forEach(button => {
            button.addEventListener('click', () => {
                const preset = button.dataset.preset;
                currentPreset = preset;
                
                // Update active state
                presetButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
        
        // Warn before leaving during compression
        window.addEventListener('beforeunload', (e) => {
            if (isCompressing) {
                e.preventDefault();
                e.returnValue = 'Video compression is in progress. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

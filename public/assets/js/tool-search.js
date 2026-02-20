// Tool Search Functionality
(function () {
	const searchInput = document.getElementById('toolSearch');
	const searchResults = document.getElementById('searchResults');

	if (!searchInput || !searchResults) return;

	// Define all tools from tools.json structure with searchable keywords
	const allTools = [
		// PDF Tools
		{ slug: 'pdf-merge', name: 'PDF Merge Tool', description: 'Combine multiple PDF files into one', category: 'PDF tools', keywords: 'pdf merge combine join' },
		{ slug: 'pdf-split', name: 'PDF Split Tool', description: 'Extract pages from PDF documents', category: 'PDF tools', keywords: 'pdf split extract separate divide' },
		{ slug: 'pdf-unlock', name: 'PDF Unlock Tool', description: 'Remove password protection from PDF files', category: 'PDF tools', keywords: 'pdf unlock password remove decrypt unprotect' },

		// Image Tools
		{ slug: 'image-to-pdf', name: 'Image to PDF Converter', description: 'Convert images to PDF documents', category: 'Image tools', keywords: 'image pdf jpg png convert' },
		{ slug: 'image-converter', name: 'Image Converter', description: 'Convert between multiple image formats', category: 'Image tools', keywords: 'image convert jpg png webp format' },
		{ slug: 'image-compressor', name: 'Image Compressor', description: 'Reduce image file sizes', category: 'Image tools', keywords: 'image compress reduce size optimize jpg png webp' },
		{ slug: 'image-resizer', name: 'Image Resizer', description: 'Resize images to custom dimensions', category: 'Image tools', keywords: 'image resize scale dimensions width height' },
		{ slug: 'image-watermark', name: 'Image Watermark Tool', description: 'Add text watermarks to images', category: 'Image tools', keywords: 'image watermark text logo copyright' },
		{ slug: 'image-crop', name: 'Image Crop Tool', description: 'Crop images to custom areas', category: 'Image tools', keywords: 'image crop cut trim' },
		{ slug: 'favicon-generator', name: 'Favicon Generator', description: 'Create favicons from images', category: 'Image tools', keywords: 'favicon icon website logo generate' },
		{ slug: 'png-to-jpg', name: 'PNG to JPG Converter', description: 'Convert PNG images to JPG', category: 'Image tools', keywords: 'png jpg jpeg convert' },
		{ slug: 'png-to-webp', name: 'PNG to WEBP Converter', description: 'Convert PNG images to WEBP', category: 'Image tools', keywords: 'png webp convert' },
		{ slug: 'jpg-to-webp', name: 'JPG to WEBP Converter', description: 'Convert JPG to WEBP format', category: 'Image tools', keywords: 'jpg jpeg webp convert' },
		{ slug: 'webp-to-jpg', name: 'WEBP to JPG Converter', description: 'Convert WEBP to JPG', category: 'Image tools', keywords: 'webp jpg jpeg convert' },
		{ slug: 'webp-to-png', name: 'WEBP to PNG Converter', description: 'Convert WEBP images to PNG', category: 'Image tools', keywords: 'webp png convert' },

		// Video Tools
		{ slug: 'video-compressor', name: 'Video Compressor Tool', description: 'Compress videos for smaller file sizes', category: 'Video tools', keywords: 'video compress reduce size mp4 webm avi mov' },
		{ slug: 'video-to-gif', name: 'Video to GIF Converter', description: 'Convert videos to animated GIFs', category: 'Video tools', keywords: 'video gif animated convert mp4 webm' }
	];

	let searchTimeout;

	function performSearch(query) {
		const trimmedQuery = query.trim().toLowerCase();

		if (!trimmedQuery) {
			searchResults.innerHTML = '';
			searchResults.style.display = 'none';
			return;
		}

		// Filter tools based on query
		const matches = allTools.filter(tool => {
			return tool.name.toLowerCase().includes(trimmedQuery) ||
				tool.description.toLowerCase().includes(trimmedQuery) ||
				tool.slug.toLowerCase().includes(trimmedQuery) ||
				tool.category.toLowerCase().includes(trimmedQuery) ||
				(tool.keywords && tool.keywords.toLowerCase().includes(trimmedQuery));
		});

		// Display results
		if (matches.length === 0) {
			searchResults.innerHTML = '<div class="search-no-results">No tools found matching your search.</div>';
			searchResults.style.display = 'block';
		} else {
			const resultsHTML = matches.map(tool => `
				<a href="/tools/${tool.slug}/" class="search-result-item">
					<div class="search-result-name">${highlightMatch(tool.name, trimmedQuery)}</div>
					<div class="search-result-desc">${highlightMatch(tool.description, trimmedQuery)}</div>
					<div class="search-result-category">${tool.category}</div>
				</a>
			`).join('');

			searchResults.innerHTML = resultsHTML;
			searchResults.style.display = 'block';
		}
	}

	function highlightMatch(text, query) {
		const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
		return text.replace(regex, '<mark>$1</mark>');
	}

	function escapeRegExp(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
	}

	// Event listeners
	searchInput.addEventListener('input', function (e) {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			performSearch(e.target.value);
		}, 200); // Debounce for 200ms
	});

	// Close search results when clicking outside
	document.addEventListener('click', function (e) {
		if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
			searchResults.style.display = 'none';
		}
	});

	// Reopen results when clicking on input with existing search
	searchInput.addEventListener('focus', function () {
		if (searchInput.value.trim() && searchResults.innerHTML) {
			searchResults.style.display = 'block';
		}
	});

	// Handle keyboard navigation
	searchInput.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			searchResults.style.display = 'none';
			searchInput.blur();
		}
	});
})();

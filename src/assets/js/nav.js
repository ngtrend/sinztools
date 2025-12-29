document.addEventListener('DOMContentLoaded', function() {
	const path = window.location.pathname;
	if (path.includes('/tools/')) {
		document.querySelector('nav a[href="/tools/"]').classList.add('active');
	} else if (path === '/' || path === '/index.html') {
		document.querySelector('nav a[href="/"]').classList.add('active');
	} else if (path === '/about.html') {
		document.querySelector('nav a[href="/about.html"]').classList.add('active');
	}
});
document.addEventListener('DOMContentLoaded', function() {
	const path = window.location.pathname;
	console.log('Current path:', path);
	if (path.includes('/tools/')) {
		console.log('Adding active to tools');
		document.querySelector('nav a[href="/tools/"]').classList.add('active');
	} else if (path === '/' || path === '/index.html') {
		console.log('Adding active to home');
		document.querySelector('nav a[href="/"]').classList.add('active');
	} else if (path === '/about.html') {
		console.log('Adding active to about');
		document.querySelector('nav a[href="/about.html"]').classList.add('active');
	}
});
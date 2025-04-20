// OpenCV.js loader script
(() => {
	// Create a script element for OpenCV.js
	const script = document.createElement('script');
	script.setAttribute('async', '');
	script.setAttribute('type', 'text/javascript');

	// CDN URL for OpenCV.js
	script.src = 'https://docs.opencv.org/4.7.0/opencv.js';

	// Log when loaded
	script.onload = () => {
		console.log('OpenCV.js is loaded successfully');

		// Dispatch a custom event that components can listen for
		const event = new CustomEvent('opencv-loaded');
		document.dispatchEvent(event);
	};

	script.onerror = (err) => {
		console.error('Failed to load OpenCV.js from CDN', err);
	};

	// Add the script to the document
	document.head.appendChild(script);
})();

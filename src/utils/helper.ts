// Facial detection helper functions
export interface FacialFeatures {
	faceContour: number[][];
	eyeRegions: { x: number; y: number; width: number; height: number }[];
	mouthRegion: { x: number; y: number; width: number; height: number } | null;
	noseRegion: { x: number; y: number; width: number; height: number } | null;
}

/**
 * Crop center of image as fallback if face detection fails
 */
export const centerCropFallback = (
	imageDataUrl: string,
	callback: (croppedDataUrl: string) => void,
) => {
	const img = new Image();
	img.onload = () => {
		const size = Math.min(img.width, img.height);
		const x = (img.width - size) / 2;
		const y = (img.height - size) / 2;

		const canvas = document.createElement('canvas');
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
		const croppedDataUrl = canvas.toDataURL();
		callback(croppedDataUrl);
	};
	img.src = imageDataUrl;
};

/**
 * Extract facial features from a detected face
 */
export const extractFacialFeatures = (
	faceImage: HTMLCanvasElement,
	handleVisualization: (
		visualizationImage: string,
		features: FacialFeatures,
	) => void,
	handleError: (error: string) => void,
): FacialFeatures | null => {
	if (typeof window === 'undefined' || !window.cv) {
		handleError('OpenCV not ready');
		return null;
	}

	try {
		const face = window.cv.imread(faceImage);

		const gray = new window.cv.Mat();
		window.cv.cvtColor(face, gray, window.cv.COLOR_RGBA2GRAY);

		const blurred = new window.cv.Mat();
		const ksize = new window.cv.Size(3, 3);
		window.cv.GaussianBlur(gray, blurred, ksize, 0);

		const edges = new window.cv.Mat();
		window.cv.Canny(blurred, edges, 50, 150);

		const contours = new window.cv.MatVector();
		const hierarchy = new window.cv.Mat();
		window.cv.findContours(
			edges,
			contours,
			hierarchy,
			window.cv.RETR_EXTERNAL,
			window.cv.CHAIN_APPROX_SIMPLE,
		);

		const facialFeatures: FacialFeatures = {
			faceContour: [] as number[][],
			eyeRegions: [] as {
				x: number;
				y: number;
				width: number;
				height: number;
			}[],
			mouthRegion: null,
			noseRegion: null,
		};

		const faceWidth = face.cols;
		const faceHeight = face.rows;

		const leftEyeROI = new window.cv.Rect(
			Math.floor(faceWidth * 0.2),
			Math.floor(faceHeight * 0.2),
			Math.floor(faceWidth * 0.25),
			Math.floor(faceHeight * 0.2),
		);

		const rightEyeROI = new window.cv.Rect(
			Math.floor(faceWidth * 0.55),
			Math.floor(faceHeight * 0.2),
			Math.floor(faceWidth * 0.25),
			Math.floor(faceHeight * 0.2),
		);

		const mouthROI = new window.cv.Rect(
			Math.floor(faceWidth * 0.3),
			Math.floor(faceHeight * 0.6),
			Math.floor(faceWidth * 0.4),
			Math.floor(faceHeight * 0.25),
		);

		const noseROI = new window.cv.Rect(
			Math.floor(faceWidth * 0.4),
			Math.floor(faceHeight * 0.4),
			Math.floor(faceWidth * 0.2),
			Math.floor(faceHeight * 0.2),
		);

		facialFeatures.eyeRegions.push(
			{
				x: leftEyeROI.x,
				y: leftEyeROI.y,
				width: leftEyeROI.width,
				height: leftEyeROI.height,
			},
			{
				x: rightEyeROI.x,
				y: rightEyeROI.y,
				width: rightEyeROI.width,
				height: rightEyeROI.height,
			},
		);

		facialFeatures.mouthRegion = {
			x: mouthROI.x,
			y: mouthROI.y,
			width: mouthROI.width,
			height: mouthROI.height,
		};

		facialFeatures.noseRegion = {
			x: noseROI.x,
			y: noseROI.y,
			width: noseROI.width,
			height: noseROI.height,
		};

		for (let i = 0; i < contours.size(); ++i) {
			const contour = contours.get(i);
			const area = window.cv.contourArea(contour);

			if (area > 100) {
				const points = [];
				for (let j = 0; j < contour.data32S.length; j += 2) {
					points.push([contour.data32S[j], contour.data32S[j + 1]]);
				}

				facialFeatures.faceContour.push(...points);
			}

			contour.delete();
		}

		const visualCanvas = document.createElement('canvas');
		visualCanvas.width = face.cols;
		visualCanvas.height = face.rows;
		window.cv.imshow(visualCanvas, face);
		const visualCtx = visualCanvas.getContext('2d');

		if (visualCtx) {
			visualCtx.strokeStyle = 'blue';
			visualCtx.lineWidth = 2;
			facialFeatures.eyeRegions.forEach((eye) => {
				visualCtx.strokeRect(eye.x, eye.y, eye.width, eye.height);
			});

			if (facialFeatures.mouthRegion) {
				visualCtx.strokeStyle = 'red';
				const mouth = facialFeatures.mouthRegion;
				visualCtx.strokeRect(mouth.x, mouth.y, mouth.width, mouth.height);
			}

			if (facialFeatures.noseRegion) {
				visualCtx.strokeStyle = 'green';
				const nose = facialFeatures.noseRegion;
				visualCtx.strokeRect(nose.x, nose.y, nose.width, nose.height);
			}

			visualCtx.fillStyle = 'yellow';
			facialFeatures.faceContour.forEach((point) => {
				visualCtx.beginPath();
				visualCtx.arc(point[0], point[1], 1, 0, 2 * Math.PI);
				visualCtx.fill();
			});

			handleVisualization(visualCanvas.toDataURL(), facialFeatures);
		}

		face.delete();
		gray.delete();
		blurred.delete();
		edges.delete();
		contours.delete();
		hierarchy.delete();

		return facialFeatures;
	} catch (err) {
		console.error('Error extracting facial features:', err);
		handleError(`Failed to extract facial features: ${err}`);
		return null;
	}
};

/**
 * Detect faces in an image using OpenCV
 */
export const detectFace = (
	imageDataUrl: string,
	cascadeClassifierData: Uint8Array | null,
	handleFaceDetected: (
		faceCanvas: HTMLCanvasElement,
		faceDataUrl: string,
	) => void,
	handleFallback: (imageDataUrl: string) => void,
	handleError: (error: string) => void,
) => {
	if (typeof window === 'undefined' || !window.cv) {
		handleError('OpenCV not ready');
		return;
	}

	const img = new Image();
	img.onload = () => {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.drawImage(img, 0, 0, img.width, img.height);

		try {
			const src = window.cv.imread(canvas);
			const gray = new window.cv.Mat();
			window.cv.cvtColor(src, gray, window.cv.COLOR_RGBA2GRAY);

			window.cv.FS_createDataFile(
				'/',
				'haarcascade_frontalface_default.xml',
				cascadeClassifierData,
				true,
				false,
				false,
			);

			const classifier = new window.cv.CascadeClassifier();
			classifier.load('/haarcascade_frontalface_default.xml');

			const faces = new window.cv.RectVector();
			classifier.detectMultiScale(gray, faces);

			if (faces.size() > 0) {
				const rect = faces.get(0);

				const face = src.roi(rect);

				const faceCanvas = document.createElement('canvas');
				faceCanvas.width = rect.width;
				faceCanvas.height = rect.height;
				window.cv.imshow(faceCanvas, face);

				const faceDataUrl = faceCanvas.toDataURL();

				handleFaceDetected(faceCanvas, faceDataUrl);

				face.delete();
			} else {
				console.log('No faces detected, using center crop fallback');
				handleFallback(imageDataUrl);
			}

			src.delete();
			gray.delete();
			faces.delete();
			classifier.delete();

			window.cv.FS_unlink('/haarcascade_frontalface_default.xml');
		} catch (err) {
			console.error('Error in face detection:', err);
			handleError('Face detection failed');
			handleFallback(imageDataUrl);
		}
	};
	img.src = imageDataUrl;
};

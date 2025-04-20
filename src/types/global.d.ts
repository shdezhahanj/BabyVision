declare global {
	interface Window {
		cv: {
			imread: (canvas: HTMLCanvasElement) => any;
			imshow: (canvas: HTMLCanvasElement, mat: any) => void;
			Mat: new () => any;
			MatVector: new () => any;
			RectVector: new () => any;
			Size: new (width: number, height: number) => any;
			Rect: new (x: number, y: number, width: number, height: number) => any;
			CascadeClassifier: new () => {
				load: (path: string) => void;
				detectMultiScale: (img: any, objects: any) => void;
				delete: () => void;
			};
			cvtColor: (src: any, dst: any, code: number) => void;
			GaussianBlur: (src: any, dst: any, ksize: any, sigmaX: number) => void;
			Canny: (
				src: any,
				dst: any,
				threshold1: number,
				threshold2: number,
			) => void;
			findContours: (
				image: any,
				contours: any,
				hierarchy: any,
				mode: number,
				method: number,
			) => void;
			contourArea: (contour: any) => number;
			FS_createDataFile: (
				parent: string,
				name: string,
				data: Uint8Array | null,
				canRead: boolean,
				canWrite: boolean,
				canOwn: boolean,
			) => void;
			FS_unlink: (path: string) => void;
			COLOR_RGBA2GRAY: number;
			RETR_EXTERNAL: number;
			CHAIN_APPROX_SIMPLE: number;
		};
	}
}

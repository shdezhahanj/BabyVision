'use client';

import {
	type FacialFeatures,
	centerCropFallback,
	detectFace,
	extractFacialFeatures,
} from '@/utils/helper';
import NextImg from 'next/image';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

export default function CustomMergePage() {
	const [opencvLoaded, setOpencvLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [cascadeClassifierData, setCascadeClassifierData] =
		useState<Uint8Array | null>(null);

	const [momImage, setMomImage] = useState<string | null>(null);
	const [dadImage, setDadImage] = useState<string | null>(null);
	const [momFaceImage, setMomFaceImage] = useState<string | null>(null);
	const [dadFaceImage, setDadFaceImage] = useState<string | null>(null);

	const [momFacialFeatures, setMomFacialFeatures] =
		useState<FacialFeatures | null>(null);
	const [dadFacialFeatures, setDadFacialFeatures] =
		useState<FacialFeatures | null>(null);
	const [momFeaturesVisualization, setMomFeaturesVisualization] = useState<
		string | null
	>(null);
	const [dadFeaturesVisualization, setDadFeaturesVisualization] = useState<
		string | null
	>(null);

	const [babyFaceImage, setBabyFaceImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [generationMessage, setGenerationMessage] = useState<string | null>(
		null,
	);

	const momInputRef = useRef<HTMLInputElement>(null);
	const dadInputRef = useRef<HTMLInputElement>(null);

	const cascadePath = '/models/haarcascade_frontalface_default.xml';

	useEffect(() => {
		const checkOpenCVReady = () => {
			if (typeof window !== 'undefined' && window.cv) {
				setOpencvLoaded(true);
			} else {
				setTimeout(checkOpenCVReady, 500);
			}
		};

		checkOpenCVReady();
	}, []);

	useEffect(() => {
		const fetchCascadeData = async () => {
			try {
				const response = await fetch(cascadePath);
				const buffer = await response.arrayBuffer();
				setCascadeClassifierData(new Uint8Array(buffer));
			} catch (err) {
				console.error('Error fetching cascade data:', err);
				setError('Failed to load face detection model');
			}
		};

		if (opencvLoaded) {
			fetchCascadeData();
		}
	}, [opencvLoaded, cascadePath]);

	// Handle image upload
	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'mom' | 'dad',
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			const imageDataUrl = event.target?.result as string;

			if (type === 'mom') {
				setMomImage(imageDataUrl);
				handleFaceDetection(imageDataUrl, type);
			} else {
				setDadImage(imageDataUrl);
				handleFaceDetection(imageDataUrl, type);
			}
		};
		reader.readAsDataURL(file);
	};

	// Function to generate baby picture
	const generateBabyPicture = () => {
		setIsLoading(true);

		// Simulate API call
		setTimeout(() => {
			setIsLoading(false);

			// Set message about backend processing
			setGenerationMessage(
				'Faces and extracted facial features would be sent to a Python backend for baby face generation. The backend would use advanced image processing and machine learning techniques to blend facial features and generate a realistic baby face prediction.',
			);

			// Clear any previous baby face image
			setBabyFaceImage(null);
		}, 1500);
	};

	const handleFaceDetection = (imageDataUrl: string, type: 'mom' | 'dad') => {
		detectFace(
			imageDataUrl,
			cascadeClassifierData,
			(faceCanvas, faceDataUrl) => {
				if (type === 'mom') {
					setMomFaceImage(faceDataUrl);
				} else {
					setDadFaceImage(faceDataUrl);
				}

				handleFeatureExtraction(faceCanvas, type);
			},
			(imageUrl) => {
				centerCropFallback(imageUrl, (croppedDataUrl) => {
					if (type === 'mom') {
						setMomFaceImage(croppedDataUrl);
					} else {
						setDadFaceImage(croppedDataUrl);
					}
				});
			},
			(errorMsg) => {
				setError(errorMsg);
			},
		);
	};

	const handleFeatureExtraction = (
		faceCanvas: HTMLCanvasElement,
		type: 'mom' | 'dad',
	) => {
		extractFacialFeatures(
			faceCanvas,
			(visualizationImage, features) => {
				if (type === 'mom') {
					setMomFeaturesVisualization(visualizationImage);
					setMomFacialFeatures(features);
				} else {
					setDadFeaturesVisualization(visualizationImage);
					setDadFacialFeatures(features);
				}
			},
			(errorMsg) => {
				setError(errorMsg);
			},
		);
	};

	// Components
	const ParentPhotoCard = ({
		type,
		image,
		faceImage,
		featuresImage,
		inputRef,
		onUpload,
	}: {
		type: 'mom' | 'dad';
		image: string | null;
		faceImage: string | null;
		featuresImage: string | null;
		inputRef: React.RefObject<HTMLInputElement>;
		onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
	}) => {
		const isParentMom = type === 'mom';
		const colorClasses = isParentMom
			? {
					text: 'text-pink-600',
					border: 'border-pink-300',
					file: 'file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100',
					featureBorder: 'border-pink-200',
				}
			: {
					text: 'text-blue-600',
					border: 'border-blue-300',
					file: 'file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100',
					featureBorder: 'border-blue-200',
				};

		return (
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className={`text-2xl font-semibold mb-4 ${colorClasses.text}`}>
					{isParentMom ? "Mom's" : "Dad's"} Photo
				</h2>
				<div
					className={`relative h-64 mb-4 border-2 border-dashed ${colorClasses.border} rounded-lg`}
				>
					{image ? (
						<NextImg
							src={image}
							alt={`${isParentMom ? "Mom's" : "Dad's"} photo`}
							fill
							className="object-cover rounded-lg"
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<p className="text-gray-500">
								Upload {isParentMom ? "mom's" : "dad's"} photo
							</p>
						</div>
					)}
				</div>
				<input
					type="file"
					accept="image/*"
					ref={inputRef}
					onChange={onUpload}
					className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${colorClasses.file}`}
				/>
				{faceImage && (
					<div className="mt-4">
						<p className="text-sm text-gray-600 mb-2">Detected Face:</p>
						<div
							className={`relative h-32 w-32 mx-auto border ${colorClasses.featureBorder} rounded-lg overflow-hidden`}
						>
							<NextImg
								src={faceImage}
								alt={`${isParentMom ? "Mom's" : "Dad's"} face`}
								fill
								className="object-cover"
							/>
						</div>
					</div>
				)}

				{featuresImage && (
					<div>
						<p className="text-sm text-gray-600 mb-2">Facial Features</p>
						<div className="relative w-64 h-64 border mx-auto">
							<NextImg
								src={featuresImage}
								alt={`${isParentMom ? "Mother's" : "Father's"} facial features`}
								fill
								className="object-contain"
							/>
						</div>
						<div className="mt-2 text-xs text-gray-500">
							<ul className="list-disc pl-5">
								<li>
									<span className="inline-block w-3 h-3 bg-blue-500 mr-1" /> Eye
									regions
								</li>
								<li>
									<span className="inline-block w-3 h-3 bg-red-500 mr-1" />{' '}
									Mouth region
								</li>
								<li>
									<span className="inline-block w-3 h-3 bg-green-500 mr-1" />{' '}
									Nose region
								</li>
								<li>
									<span className="inline-block w-3 h-3 bg-yellow-500 mr-1" />{' '}
									Facial contour points
								</li>
							</ul>
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<main className="min-h-screen p-8 bg-gradient-to-b from-pink-50 to-blue-50">
			<Script src="/models/opencv-loader.js" strategy="beforeInteractive" />

			<div className="max-w-5xl mx-auto">
				<h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
					Baby Vision Generator
				</h1>

				<p className="text-center mb-8 text-gray-600">
					Upload photos of both parents to extract facial features and generate
					a baby picture.
				</p>

				{error && (
					<div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
						<div className="flex items-center">
							<svg
								className="w-5 h-5 text-red-500 mr-2"
								fill="currentColor"
								viewBox="0 0 20 20"
								xmlns="http://www.w3.org/2000/svg"
							>
								<title>error</title>
								<path
									fillRule="evenodd"
									d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
									clipRule="evenodd"
								/>
							</svg>
							<h3 className="text-lg font-medium text-red-800">Error</h3>
						</div>
						<p className="mt-2 text-sm text-red-700">{error}</p>
						<button
							type="button"
							className="mt-3 px-4 py-2 bg-red-100 text-red-800 text-xs font-medium rounded-md hover:bg-red-200"
							onClick={() => setError(null)}
						>
							Dismiss
						</button>
					</div>
				)}

				<div className="bg-white p-6 rounded-lg shadow-lg mb-8">
					<h2 className="text-xl font-semibold mb-4 text-purple-600">
						Advanced Feature Detection
					</h2>
					<p className="text-gray-700 mb-4">
						This tool attempts to detect faces in your uploaded images using
						OpenCV.js. If face detection fails, it will automatically fall back
						to cropping the center of the image. Results will appear below each
						image after processing.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
					{/* Mom's Photo Upload */}
					<ParentPhotoCard
						type="mom"
						image={momImage}
						faceImage={momFaceImage}
						featuresImage={momFeaturesVisualization}
						inputRef={momInputRef}
						onUpload={(e) => handleImageUpload(e, 'mom')}
					/>

					{/* Dad's Photo Upload */}
					<ParentPhotoCard
						type="dad"
						image={dadImage}
						faceImage={dadFaceImage}
						featuresImage={dadFeaturesVisualization}
						inputRef={dadInputRef}
						onUpload={(e) => handleImageUpload(e, 'dad')}
					/>
				</div>

				{generationMessage && (
					<div className="mt-8 mb-8">
						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
							<h3 className="text-lg font-semibold mb-2">
								Backend Processing Required
							</h3>
							<p>{generationMessage}</p>
						</div>
					</div>
				)}

				{babyFaceImage && (
					<div className="mt-4">
						<h3 className="text-lg font-semibold">Generated Baby Face</h3>
						<div className="border border-gray-300 rounded p-2">
							<img
								src={babyFaceImage}
								alt="Generated Baby"
								className="max-w-full h-auto"
							/>
						</div>
					</div>
				)}

				<div className="flex justify-center gap-4 mb-8">
					<button
						type="button"
						className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						onClick={generateBabyPicture}
						disabled={!momFacialFeatures || !dadFacialFeatures || isLoading}
					>
						{isLoading ? 'Generating...' : 'Generate Baby Picture'}
					</button>
				</div>
			</div>
		</main>
	);
}

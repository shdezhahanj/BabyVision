import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'BabyVision',
		short_name: 'BabyVision',
		description:
			'A vision-based application designed for early childhood development and monitoring.',
		start_url: '/',
		display: 'standalone',
		orientation: 'portrait',
		background_color: '#ffffff',
		theme_color: '#50bfe8',
	};
}

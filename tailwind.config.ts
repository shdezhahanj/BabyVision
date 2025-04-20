import type { Config } from 'tailwindcss';
import { BREAKPOINTS } from './src/utils/enum';

const config: Config = {
	content: [
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				geist: ['var(--font-geist-sans)'],
			},
			width: BREAKPOINTS,
			minWidth: BREAKPOINTS,
			maxWidth: BREAKPOINTS,
		},
		screens: BREAKPOINTS,
	},
	plugins: [],
};
export default config;

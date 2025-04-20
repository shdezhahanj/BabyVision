import type { Metadata } from 'next';
import '@/styles/globals.scss';
import { Footer, Header } from '@/components';
import { GeistSans } from 'geist/font/sans';

export const metadata: Metadata = {
	title: 'Baby Vision - See Your Future Baby',
	description:
		'Baby Vision helps you visualize what your future baby might look like by blending parent photos using advanced image processing.',
	icons: {
		icon: [{ url: '/favicon/favicon.svg', type: 'image/svg+xml' }],
		apple: [{ url: '/favicon/favicon.svg' }],
		shortcut: [{ url: '/favicon/favicon.svg' }],
	},
};

interface LayoutProps {
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children }: LayoutProps) {
	return (
		<html lang="en" className={`${GeistSans.variable} antialiased`}>
			<body>
				<Header />
				{children}
				<Footer />
			</body>
		</html>
	);
}

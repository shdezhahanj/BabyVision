import { Icon } from '@/components';
import Link from 'next/link';
import type { FC } from 'react';

export const Footer: FC = () => {
	return (
		<footer className="flex w-full border-t border-t-black/10 bg-white py-6">
			<div className="mx-auto flex items-center gap-3">
				<span className="text-sm text-gray-500">By: Shekoofeh Dezhahanj</span>
				<Link
					href="http://shekoofehdezhahanj.com"
					target="_blank"
					aria-label="Personal website"
				>
					<Icon
						name="Globe"
						className="h-5 w-5 text-gray-500 hover:text-blue-500 transition-colors"
					/>
				</Link>
				<Link
					href="https://github.com/shdezhahanj"
					target="_blank"
					aria-label="GitHub"
				>
					<Icon
						name="GitHub"
						className="h-5 w-5 text-gray-500 hover:text-blue-500 transition-colors"
					/>
				</Link>
				<Link
					href="https://linkedin.com/in/shekoofeh-dezhahanj"
					target="_blank"
					aria-label="LinkedIn"
				>
					<Icon
						name="LinkedIn"
						className="h-5 w-5 text-gray-500 hover:text-blue-500 transition-colors"
					/>
				</Link>
			</div>
		</footer>
	);
};

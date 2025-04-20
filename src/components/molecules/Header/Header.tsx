'use client';
import { Icon } from '@/components';
import type { FC } from 'react';

export const Header: FC = () => {
	return (
		<header className="sticky left-0 top-0 z-50 w-full border-b border-b-regular bg-background/80 backdrop-blur-md p-4 shadow-sm">
			<div className="mx-auto flex w-full max-w-4xl items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-r from-pink-400 to-blue-400 p-1">
						<div className="flex h-full w-full items-center justify-center rounded-full bg-white dark:bg-gray-900">
							<Icon name="React" className="h-6 w-6 text-pink-500" />
						</div>
					</div>
					<div className="flex flex-col">
						<span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-blue-500 bg-clip-text text-transparent">
							Baby Vision
						</span>
						<span className="text-xs text-gray-500 dark:text-gray-400">
							See your future baby
						</span>
					</div>
				</div>
			</div>
		</header>
	);
};

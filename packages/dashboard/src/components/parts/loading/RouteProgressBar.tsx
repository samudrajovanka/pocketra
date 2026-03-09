import { useRouterState } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export function RouteProgressBar() {
	const isLoading = useRouterState({ select: (s) => s.status === 'pending' });
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;

		if (isLoading) {
			setProgress(10);
			const incrementProgress = () => {
				setProgress((old) => {
					if (old >= 90) return old;
					const increment = Math.max(1, (90 - old) / 10);
					return old + increment;
				});
				timer = setTimeout(incrementProgress, 100);
			};
			timer = setTimeout(incrementProgress, 50);
		} else {
			setProgress(100);
			timer = setTimeout(() => {
				setProgress(0);
			}, 300);
		}

		return () => clearTimeout(timer);
	}, [isLoading]);

	if (progress === 0) return null;

	return (
		<div
			className="fixed top-0 left-0 right-0 z-100 h-1 bg-primary transition-all duration-200 ease-out"
			style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
		/>
	);
}

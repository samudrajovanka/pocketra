import { useEffect, useRef } from 'react';

type UseInfiniteScrollOptions = {
	hasNextPage: boolean;
	fetchNextPage: () => void;
	threshold?: number;
	rootMargin?: string;
};

export function useInfiniteScroll({
	hasNextPage,
	fetchNextPage,
	threshold = 1.0,
	rootMargin = '0px',
}: UseInfiniteScrollOptions) {
	const observerTarget = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold, rootMargin },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [hasNextPage, fetchNextPage, threshold, rootMargin]);

	return observerTarget;
}

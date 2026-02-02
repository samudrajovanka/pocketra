import { Skeleton } from '@/components/ui/skeleton';

const PocketListLoading = () => {
	return (
		<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
			{[...Array(3)].map((_, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: use index key
				<Skeleton key={i} className="h-40 w-full rounded-xl" />
			))}
		</div>
	);
};

export default PocketListLoading;

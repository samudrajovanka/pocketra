import { Skeleton } from '@/components/ui/skeleton';

const TransactionListLoading = () => {
	return (
		<div className="space-y-2">
			{Array.from({ length: 5 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: use index
				<Skeleton key={index} className="h-16 w-full rounded-xl" />
			))}
		</div>
	);
};

export default TransactionListLoading;

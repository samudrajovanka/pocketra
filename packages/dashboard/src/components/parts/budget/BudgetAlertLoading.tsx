import { Skeleton } from '@/components/ui/skeleton';

export function BudgetAlertLoading() {
	return (
		<div className="w-full p-4 border border-border rounded-lg bg-card">
			<div className="flex items-center gap-3">
				<Skeleton className="h-4 w-4 rounded-full shrink-0" />

				<div className="flex-1 space-y-3">
					<div className="flex items-center justify-between">
						<Skeleton className="h-5 w-48" />
						<Skeleton className="h-8 w-8 rounded" />
					</div>

					<Skeleton className="h-2 w-full rounded-full" />

					<div className="flex justify-between">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-4 w-32" />
					</div>
				</div>
			</div>
		</div>
	);
}

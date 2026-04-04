import { Badge } from '@/components/ui/badge';
import { ProgressWithThreshold } from '@/components/ui/progress';
import TextCurrency from '@/components/ui/text-currency';
import { cn } from '@/lib/utils';
import type { BudgetWithProgress } from '@/types/budget';

interface BudgetProgressProps {
	budget: BudgetWithProgress;
	className?: string;
}

export function BudgetProgress({ budget, className }: BudgetProgressProps) {
	const {
		currentSpent,
		limitAmount,
		progressPercentage,
		shouldAlert,
		isOverBudget,
		alertThreshold,
	} = budget;

	const getStatusVariant = () => {
		if (isOverBudget) return 'destructive';
		if (shouldAlert) return 'warning';
		return 'default';
	};

	return (
		<div className={cn('@container/budget', className)}>
			<div className="flex items-center justify-end mb-2">
				<Badge variant={getStatusVariant()}>
					{Math.round(progressPercentage)}%
				</Badge>
			</div>

			<ProgressWithThreshold
				threshold={alertThreshold}
				className="mb-2"
				progressProps={{
					value: Math.min(progressPercentage, 100),
					indicatorClassName: cn(
						isOverBudget
							? 'bg-red-500'
							: shouldAlert
								? 'bg-amber-500'
								: 'bg-blue-500',
					),
				}}
			/>

			<div className="flex justify-between items-center text-xs @lg/budget:text-sm">
				<div className="flex flex-col @lg/budget:flex-row @lg/budget:items-center @lg/budget:gap-1">
					<span>Spent:</span>
					<TextCurrency amount={currentSpent} className="font-medium" />
				</div>
				<div className="flex flex-col @lg/budget:flex-row @lg/budget:items-center @lg/budget:gap-1">
					<span className="@lg/budget:hidden">of</span>
					<TextCurrency
						amount={parseFloat(limitAmount)}
						className="font-medium"
					/>
				</div>
			</div>
		</div>
	);
}

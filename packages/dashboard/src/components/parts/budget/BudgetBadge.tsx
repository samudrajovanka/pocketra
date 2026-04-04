import { SimpleTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { usePocketBudgetQuery } from '@/query/budget';

interface BudgetBadgeProps {
	pocketId: string;
	className?: string;
}

export function BudgetBadge({ pocketId, className }: BudgetBadgeProps) {
	const { data: budgetResponse } = usePocketBudgetQuery(pocketId);
	const budget = budgetResponse?.data?.data;

	if (!budget || (!budget.shouldAlert && !budget.isOverBudget)) {
		return null;
	}

	const getBadgeColor = () => {
		if (budget.isOverBudget) {
			return 'bg-red-500';
		}
		return 'bg-amber-500';
	};

	const getTooltipContent = () => {
		if (budget.isOverBudget) {
			return 'Over Budget';
		}
		return 'Budget Warning';
	};

	return (
		<SimpleTooltip content={getTooltipContent()}>
			<div
				className={cn(
					'w-3 h-3 rounded-full shrink-0 animate-pulse',
					getBadgeColor(),
					className,
				)}
			/>
		</SimpleTooltip>
	);
}

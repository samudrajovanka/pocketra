import { AlertCircle } from 'lucide-react';
import { useCallback } from 'react';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { usePocketBudgetQuery } from '@/query/budget';
import type { BudgetWithProgress } from '@/types/budget';
import type { Pocket } from '@/types/pocket';
import { BudgetAction } from './BudgetAction';
import { BudgetAlertLoading } from './BudgetAlertLoading';
import { BudgetProgress } from './BudgetProgress';

interface BudgetAlertProps {
	pocket: Pocket;
	className?: string;
}

export function BudgetAlert({ pocket, className }: BudgetAlertProps) {
	const budgetQuery = usePocketBudgetQuery(pocket.id);

	const getAlertVariant = useCallback((budget: BudgetWithProgress) => {
		if (budget.isOverBudget) return 'destructive';
		if (budget.shouldAlert) return 'warning';
		return 'default';
	}, []);

	const getAlertMessage = useCallback(
		(budget: BudgetWithProgress) => {
			if (budget.isOverBudget) {
				return `Budget exceeded for ${pocket.name}`;
			}
			if (budget.shouldAlert) {
				return `Budget alert: ${pocket.name} has reached ${Math.round(budget.progressPercentage)}% of limit`;
			}

			return `Budget tracking: ${pocket.name} is at ${Math.round(budget.progressPercentage)}% of budget`;
		},
		[pocket.name],
	);

	return (
		<QueryHandling
			queryResult={budgetQuery}
			renderLoading={<BudgetAlertLoading />}
			renderNotFound={null}
			render={({ data }) => {
				const budget = data.data;

				return (
					<Alert
						variant={getAlertVariant(budget)}
						className={cn('w-full', className)}
					>
						<AlertCircle />
						<AlertTitle>{getAlertMessage(budget)}</AlertTitle>
						<AlertDescription>
							<div className="w-full mt-5">
								<div className="absolute right-4 top-3">
									<BudgetAction pocket={pocket} budget={budget} />
								</div>

								<BudgetProgress budget={budget} />
							</div>
						</AlertDescription>
					</Alert>
				);
			}}
		/>
	);
}

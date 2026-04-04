import { Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { BudgetWithProgress } from '@/types/budget';
import type { Pocket } from '@/types/pocket';
import { BudgetForm } from './BudgetForm';
import { DeleteBudgetDialog } from './DeleteBudgetDialog';

interface BudgetActionProps {
	pocket: Pocket;
	budget: BudgetWithProgress;
}

export function BudgetAction({ pocket, budget }: BudgetActionProps) {
	const [showBudgetForm, setShowBudgetForm] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="icon-sm">
						<MoreHorizontal />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-40 p-2">
					<div className="flex flex-col gap-1">
						<Button
							variant="ghost"
							size="sm"
							className="w-full justify-start"
							onClick={() => setShowBudgetForm(true)}
						>
							<Edit />
							Edit
						</Button>
						<Button
							variant="ghostDestructive"
							size="sm"
							className="w-full justify-start"
							onClick={() => setShowDeleteDialog(true)}
						>
							<Trash2 />
							Delete
						</Button>
					</div>
				</PopoverContent>
			</Popover>

			<DeleteBudgetDialog
				pocket={pocket}
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			/>

			<BudgetForm
				pocketId={pocket.id}
				open={showBudgetForm}
				onClose={() => setShowBudgetForm(false)}
				type="update"
				initialValues={{
					limitAmount: Number(budget.limitAmount),
					alertThreshold: budget.alertThreshold,
					period: budget.period,
				}}
			/>
		</>
	);
}

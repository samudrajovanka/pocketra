import { Link } from '@tanstack/react-router';
import { Edit, MoreHorizontal, Target, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { Pocket } from '@/types/pocket';
import { BudgetForm } from '../budget/BudgetForm';
import DeletePocketDialog from './DeletePocketDialog';

type PocketActionProps = {
	pocket: Pocket;
};

const PocketAction = ({ pocket }: PocketActionProps) => {
	const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);
	const [isShowBudgetForm, setIsShowBudgetForm] = useState(false);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline" size="icon">
						<MoreHorizontal />
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-40 p-2">
					<div className="flex flex-col gap-1">
						<Link
							to="/pockets/$id/edit"
							params={{ id: pocket.id }}
							className="w-full"
						>
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-start"
							>
								<Edit />
								Customize
							</Button>
						</Link>
						{!pocket.hasBudget && (
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-start"
								onClick={() => setIsShowBudgetForm(true)}
							>
								<Target />
								Add Budget
							</Button>
						)}
						<Button
							variant="ghostDestructive"
							size="sm"
							className="w-full justify-start"
							onClick={() => setIsShowDeleteDialog(true)}
						>
							<Trash2 />
							Delete
						</Button>
					</div>
				</PopoverContent>
			</Popover>

			<DeletePocketDialog
				pocket={pocket}
				open={isShowDeleteDialog}
				onOpenChange={setIsShowDeleteDialog}
			/>

			<BudgetForm
				pocketId={pocket.id}
				open={isShowBudgetForm}
				onClose={() => setIsShowBudgetForm(false)}
				type="create"
			/>
		</>
	);
};

export default PocketAction;

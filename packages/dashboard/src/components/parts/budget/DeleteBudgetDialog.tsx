import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDeletePocketBudgetMutation } from '@/query/budget';
import type { Pocket } from '@/types/pocket';

interface DeleteBudgetDialogProps {
	pocket: Pocket;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted?: () => void;
}

export function DeleteBudgetDialog({
	pocket,
	open,
	onOpenChange,
}: DeleteBudgetDialogProps) {
	const deleteMutation = useDeletePocketBudgetMutation();

	const handleDelete = async () => {
		await deleteMutation.mutateAsync(pocket.id);
		onOpenChange(false);
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={(open) => {
				if (!deleteMutation.isPending) {
					onOpenChange(open);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						budget for "{pocket.name}".
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						variant="destructive"
						onClick={(e) => {
							e.preventDefault();
							handleDelete();
						}}
						disabled={deleteMutation.isPending}
					>
						{deleteMutation.isPending ? 'Deleting...' : 'Delete Budget'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

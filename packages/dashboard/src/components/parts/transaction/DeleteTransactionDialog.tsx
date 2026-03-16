import { useNavigate, useSearch } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';

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
import { useDeleteTransactionMutation } from '@/query/transaction';

type DeleteTransactionDialogProps = {
	transactionId: string;
	pocketId?: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const DeleteTransactionDialog = ({
	open,
	onOpenChange,
	transactionId,
	pocketId,
}: DeleteTransactionDialogProps) => {
	const navigate = useNavigate();
	const search = useSearch({ strict: false }) as {
		from?: 'detail_pocket';
	};
	const deleteTransactionMutation = useDeleteTransactionMutation();

	const handleDelete = async () => {
		try {
			await deleteTransactionMutation.mutateAsync(transactionId);
			toast.success('Transaction deleted successfully');
			navigate({
				to:
					search.from === 'detail_pocket' && pocketId
						? `/pockets/${pocketId}`
						: '/transactions',
				replace: true,
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to delete transaction');
			}
		}
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={() => {
				if (!deleteTransactionMutation.isPending) {
					onOpenChange(false);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						transaction.
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
						disabled={deleteTransactionMutation.isPending}
					>
						{deleteTransactionMutation.isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeleteTransactionDialog;

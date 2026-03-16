import { useNavigate } from '@tanstack/react-router';
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
import { useDeletePocketMutation } from '@/query/pocket';
import type { Pocket } from '@/types/pocket';

type DeletePocketDialogProps = {
	pocket: Pocket;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

const DeletePocketDialog = ({
	pocket,
	open,
	onOpenChange,
}: DeletePocketDialogProps) => {
	const navigate = useNavigate();
	const deleteMutation = useDeletePocketMutation();

	const handleDelete = async () => {
		await deleteMutation.mutateAsync(pocket.id);
		navigate({ to: '/pockets', replace: true });
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={() => {
				if (!deleteMutation.isPending) {
					onOpenChange(false);
				}
			}}
		>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action cannot be undone. This will permanently delete the
						pocket "{pocket.name}".
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
						{deleteMutation.isPending ? 'Deleting...' : 'Delete'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default DeletePocketDialog;

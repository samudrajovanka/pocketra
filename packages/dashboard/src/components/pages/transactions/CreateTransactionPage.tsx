import { useNavigate, useSearch } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import TransactionForm from '@/components/parts/transaction/TransactionForm';
import TransferPocketForm from '@/components/parts/transaction/TransferPocketForm';
import PageTitle from '@/components/ui/page-title';
import type {
	CreateTransactionPayload,
	TransferTransactionPayload,
} from '@/endpoints/transaction/types';
import {
	useCreateTransactionMutation,
	useTransferTransactionMutation,
} from '@/query/transaction';

export default function CreateTransactionPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: '/_authed/transactions/new' });
	const { mutateAsync: createTransaction, isPending: isCreating } =
		useCreateTransactionMutation();
	const { mutateAsync: transferTransaction, isPending: isTransferring } =
		useTransferTransactionMutation();

	const handleCreateSubmit = async (values: CreateTransactionPayload) => {
		try {
			await createTransaction(values);
			toast.success('Transaction created successfully');
			navigate({
				to:
					search.from === 'detail_pocket'
						? `/pockets/${values.pocketId}`
						: '/transactions',
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to create transaction');
			}
		}
	};

	const handleTransferSubmit = async (values: TransferTransactionPayload) => {
		try {
			await transferTransaction(values);
			toast.success('Transfer successful');
			navigate({
				to:
					search.from === 'detail_pocket'
						? `/pockets/${values.fromPocketId}`
						: '/transactions',
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to transfer pocket');
			}
		}
	};

	const isTransfer = search.method === 'transfer';

	return (
		<div>
			<DashboardStickyHeader>
				<PageTitle
					title={isTransfer ? 'Transfer Balance' : 'Create Transaction'}
				/>
			</DashboardStickyHeader>

			<DashboardBody>
				{isTransfer ? (
					<TransferPocketForm
						type="create"
						onSubmit={handleTransferSubmit}
						isSubmitting={isTransferring}
						fromPocketId={search.from_pocket_id}
					/>
				) : (
					<TransactionForm
						onSubmit={handleCreateSubmit}
						type="create"
						isSubmitting={isCreating}
						fromPocketId={search.pocket_id}
					/>
				)}
			</DashboardBody>
		</div>
	);
}

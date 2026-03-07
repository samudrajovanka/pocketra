import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import QueryHandling from '@/components/parts/query/QueryHandling';
import NotFoundTransaction from '@/components/parts/transaction/NotFoundTransaction';
import TransactionForm from '@/components/parts/transaction/TransactionForm';
import TransferPocketForm from '@/components/parts/transaction/TransferPocketForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import type {
	UpdateTransactionPayload,
	UpdateTransferTransactionPayload,
} from '@/endpoints/transaction/types';
import { isEditableTransaction } from '@/lib/helpers/transactions';
import {
	useGetTransactionByIdQuery,
	useUpdateTransactionMutation,
	useUpdateTransferTransactionMutation,
} from '@/query/transaction';

export default function EditTransactionPage() {
	const { id } = useParams({ from: '/_authed/transactions/$id/edit' });
	const navigate = useNavigate();
	const search = useSearch({ from: '/_authed/transactions/$id/edit' });
	const getTransactionByIdQuery = useGetTransactionByIdQuery(id);
	const { mutateAsync: updateTransaction, isPending: isUpdatingTransaction } =
		useUpdateTransactionMutation();
	const {
		mutateAsync: updateTransferTransaction,
		isPending: isUpdatingTransfer,
	} = useUpdateTransferTransactionMutation();

	const handleTransactionSubmit = async (values: UpdateTransactionPayload) => {
		try {
			await updateTransaction({
				id,
				payload: values,
			});
			toast.success('Transaction updated successfully');
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
				toast.error('Failed to update transaction');
			}
		}
	};

	const handleTransferSubmit = async (
		values: UpdateTransferTransactionPayload,
	) => {
		try {
			const transferId = getTransactionByIdQuery.data?.data.data.transferId;
			if (!transferId) throw new Error('Transfer ID not found');

			await updateTransferTransaction({
				id: transferId,
				payload: values,
			});
			toast.success('Transfer updated successfully');
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
				toast.error('Failed to update transfer');
			}
		}
	};

	return (
		<div>
			<HeaderDashboardInset>
				<PageTitle title="Edit Transaction" />
			</HeaderDashboardInset>

			<QueryHandling
				queryResult={getTransactionByIdQuery}
				renderLoading={<Skeleton className="h-100 w-full rounded-xl" />}
				renderNotFound={<NotFoundTransaction />}
				render={({ data }) => {
					const transaction = data.data;
					const isEditable = isEditableTransaction(transaction.createdAt);
					const isTransfer = !!transaction.transferId;

					return (
						<div className="space-y-6">
							{!isEditable && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertTitle>Cannot Edit</AlertTitle>
									<AlertDescription>
										This transaction is older than 1 week after created and
										cannot be edited.
									</AlertDescription>
								</Alert>
							)}

							{isTransfer ? (
								<TransferPocketForm
									type="update"
									initialValues={{
										fromPocketId:
											transaction.type === 'transfer_out'
												? transaction.pocketId
												: (transaction.relatedPocketId ?? undefined),
										toPocketId:
											transaction.type === 'transfer_out'
												? (transaction.relatedPocketId ?? undefined)
												: transaction.pocketId,
										amount: Number(transaction.amount),
										description: transaction.description || '',
										date: transaction.date,
									}}
									onSubmit={handleTransferSubmit}
									disabled={!isEditable}
									isSubmitting={isUpdatingTransfer}
									submitText="Save"
									submitTextLoading="Saving..."
								/>
							) : (
								<TransactionForm
									type="update"
									initialValues={{
										pocketId: transaction.pocketId,
										categoryId: transaction.categoryId,
										amount: Number(transaction.amount),
										description: transaction.description || '',
										date: transaction.date,
										type: transaction.type,
									}}
									onSubmit={handleTransactionSubmit}
									disabled={!isEditable}
									isSubmitting={isUpdatingTransaction}
								/>
							)}
						</div>
					);
				}}
			/>
		</div>
	);
}

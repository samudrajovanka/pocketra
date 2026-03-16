import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { useCallback } from 'react';
import { toast } from 'sonner';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import QueryHandling from '@/components/parts/query/QueryHandling';
import CannotEditTransactionAlert from '@/components/parts/transaction/CannotEditTransactionAlert';
import NotFoundTransaction from '@/components/parts/transaction/NotFoundTransaction';
import TransactionForm from '@/components/parts/transaction/TransactionForm';
import TransferPocketForm from '@/components/parts/transaction/TransferPocketForm';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import type {
	UpdateTransactionPayload,
	UpdateTransferTransactionPayload,
} from '@/endpoints/transaction/types';
import { TRANSACTION_TYPE } from '@/lib/constants/transactions';
import {
	isEditableTransaction,
	isTransferTransaction,
} from '@/lib/helpers/transactions';
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
				replace: true,
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to update transaction');
			}
		}
	};

	const generateSuccessTransferNavigate = useCallback(
		(fromPocketId: string, toPocketId: string) => {
			if (search.from !== 'detail_pocket') return '/transactions';

			switch (search.method) {
				case TRANSACTION_TYPE.transfer_in:
					return `/pockets/${toPocketId}`;
				case TRANSACTION_TYPE.transfer_out:
					return `/pockets/${fromPocketId}`;
			}
		},
		[search.from, search.method],
	);

	const handleTransferSubmit = async (
		values: UpdateTransferTransactionPayload,
	) => {
		try {
			const transaction = getTransactionByIdQuery.data?.data.data;

			if (!transaction || !isTransferTransaction(transaction)) {
				throw new Error('Transaction is not a transfer');
			}

			const transferId = transaction.transferId;
			if (!transferId) throw new Error('Transfer ID not found');

			await updateTransferTransaction({
				id: transferId,
				payload: values,
			});
			toast.success('Transfer updated successfully');

			navigate({
				to: generateSuccessTransferNavigate(
					values.fromPocketId,
					values.toPocketId,
				),
				replace: true,
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
			<QueryHandling
				queryResult={getTransactionByIdQuery}
				renderLoading={
					<>
						<DashboardStickyHeader>
							<PageTitle title="Edit Transaction" />
						</DashboardStickyHeader>
						<DashboardBody>
							<Skeleton className="h-100 w-full rounded-xl" />
						</DashboardBody>
					</>
				}
				renderNotFound={<NotFoundTransaction />}
				render={({ data }) => {
					const transaction = data.data;
					const isEditable = isEditableTransaction(transaction.createdAt);
					const isTransfer = isTransferTransaction(transaction);

					const backTo =
						search.from === 'detail_pocket'
							? `/pockets/${transaction.pocketId}`
							: '/transactions';

					return (
						<>
							<DashboardStickyHeader>
								<PageTitle title="Edit Transaction" backTo={backTo} />
							</DashboardStickyHeader>

							<DashboardBody>
								<div className="space-y-6">
									{!isEditable && <CannotEditTransactionAlert />}

									{isTransfer ? (
										<TransferPocketForm
											type="update"
											initialValues={{
												fromPocketId:
													transaction.type === 'transfer_out'
														? transaction.pocketId
														: transaction.relatedPocketId,
												toPocketId:
													transaction.type === 'transfer_out'
														? transaction.relatedPocketId
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
							</DashboardBody>
						</>
					);
				}}
			/>
		</div>
	);
}

import { useNavigate, useParams } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import QueryHandling from '@/components/parts/query/QueryHandling';
import NotFoundTransaction from '@/components/parts/transaction/NotFoundTransaction';
import TransactionForm from '@/components/parts/transaction/TransactionForm';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import type { UpdateTransactionPayload } from '@/endpoints/transaction/types';
import { isEditableTransaction } from '@/lib/helpers/transactions';
import {
	useGetTransactionByIdQuery,
	useUpdateTransactionMutation,
} from '@/query/transaction';

export default function EditTransactionPage() {
	const { id } = useParams({ from: '/_authed/transactions/$id/edit' });
	const navigate = useNavigate();
	const getTransactionByIdQuery = useGetTransactionByIdQuery(id);
	const { mutateAsync: updateTransaction, isPending } =
		useUpdateTransactionMutation();

	const handleSubmit = async (values: UpdateTransactionPayload) => {
		try {
			await updateTransaction({
				id,
				payload: values,
			});
			toast.success('Transaction updated successfully');
			navigate({ to: '/transactions' });
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to update transaction');
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

					return (
						<div className="space-y-6">
							{!isEditable && (
								<Alert variant="destructive">
									<AlertCircle />
									<AlertTitle>Cannot Edit</AlertTitle>
									<AlertDescription>
										This transaction is older than 1 week after created and
										cannot be edited.
									</AlertDescription>
								</Alert>
							)}

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
								onSubmit={handleSubmit}
								disabled={!isEditable}
								isSubmitting={isPending}
							/>
						</div>
					);
				}}
			/>
		</div>
	);
}

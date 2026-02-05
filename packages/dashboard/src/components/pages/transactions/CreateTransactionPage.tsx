import { useNavigate, useSearch } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import TransactionForm from '@/components/parts/transaction/TransactionForm';
import PageTitle from '@/components/ui/page-title';
import type { CreateTransactionPayload } from '@/endpoints/transaction/types';
import { useCreateTransactionMutation } from '@/query/transaction';

export default function CreateTransactionPage() {
	const navigate = useNavigate();
	const search = useSearch({ from: '/_authed/transactions/new' });
	const { mutateAsync: createTransaction, isPending } =
		useCreateTransactionMutation();

	const handleSubmit = async (values: CreateTransactionPayload) => {
		try {
			await createTransaction(values);
			toast.success('Transaction created successfully');
			navigate({
				to:
					search.navigate_after_create === 'selected-pocket'
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

	return (
		<div>
			<HeaderDashboardInset>
				<PageTitle title="Create Transaction" />
			</HeaderDashboardInset>

			<TransactionForm
				onSubmit={handleSubmit}
				type="create"
				isSubmitting={isPending}
				initialValues={
					search.pocket_id
						? {
								pocketId: search.pocket_id,
								description: '',
								amount: 0,
								type: 'expense',
								categoryId: '',
								date: new Date().toISOString(),
							}
						: undefined
				}
			/>
		</div>
	);
}

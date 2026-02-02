import { useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import TransactionForm from '@/components/parts/transaction/TransactionForm';
import PageTitle from '@/components/ui/page-title';
import type { CreateTransactionPayload } from '@/endpoints/transaction/types';
import { useCreateTransactionMutation } from '@/query/transaction';

export default function CreateTransactionPage() {
	const navigate = useNavigate();
	const { mutateAsync: createTransaction, isPending } =
		useCreateTransactionMutation();

	const handleSubmit = async (values: CreateTransactionPayload) => {
		try {
			await createTransaction(values);
			toast.success('Transaction created successfully');
			navigate({ to: '/transactions' });
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
				<PageTitle title="Create Transaction" backTo="/transactions" />
			</HeaderDashboardInset>

			<TransactionForm
				onSubmit={handleSubmit}
				type="create"
				isSubmitting={isPending}
			/>
		</div>
	);
}

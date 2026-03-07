import {
	createFileRoute,
	useNavigate,
	useParams,
} from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import TransferPocketForm from '@/components/parts/pocket/TransferPocketForm';
import PageTitle from '@/components/ui/page-title';
import type { TransferTransactionPayload } from '@/endpoints/transaction/types';
import { useTransferTransactionMutation } from '@/query/transaction';

export const Route = createFileRoute('/_authed/pockets/$id/transfer')({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { id } = useParams({ from: '/_authed/pockets/$id/transfer' });
	const { mutateAsync: transferTransaction, isPending } =
		useTransferTransactionMutation();

	const handleSubmit = async (values: TransferTransactionPayload) => {
		try {
			await transferTransaction(values);
			toast.success('Pocket transferred successfully');
			navigate({
				to: `/pockets/${id}`,
			});
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to transfer pocket');
			}
		}
	};

	return (
		<div>
			<HeaderDashboardInset>
				<PageTitle title="Transfer Pocket" />
			</HeaderDashboardInset>

			<TransferPocketForm
				fromPocketId={id}
				onSubmit={handleSubmit}
				isSubmitting={isPending}
			/>
		</div>
	);
}

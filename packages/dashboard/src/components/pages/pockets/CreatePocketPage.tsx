import { useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import PocketForm from '@/components/parts/pocket/PocketForm';
import PageTitle from '@/components/ui/page-title';
import type { CreatePocketPayload } from '@/endpoints/pocket/types';
import { useCreatePocketMutation } from '@/query/pocket';

const CreatePocketPage = () => {
	const navigate = useNavigate();
	const createMutation = useCreatePocketMutation();

	const handleSubmit = async (values: CreatePocketPayload) => {
		try {
			await createMutation.mutateAsync(values);
			toast.success('Pocket created successfully');
			navigate({ to: '/pockets' });
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to create pocket');
			}
		}
	};

	return (
		<div>
			<HeaderDashboardInset>
				<PageTitle title="Create Pocket" />
			</HeaderDashboardInset>

			<PocketForm
				onSubmit={handleSubmit}
				isSubmitting={createMutation.isPending}
				submitText="Create Pocket"
				type="create"
			/>
		</div>
	);
};

export default CreatePocketPage;

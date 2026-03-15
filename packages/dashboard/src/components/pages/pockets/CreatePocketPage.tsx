import { useNavigate } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
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
			navigate({ to: '/pockets', replace: true });
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
			<DashboardStickyHeader>
				<PageTitle title="Create Pocket" backTo="/pockets" />
			</DashboardStickyHeader>

			<DashboardBody>
				<PocketForm
					onSubmit={handleSubmit}
					isSubmitting={createMutation.isPending}
					submitText="Create Pocket"
					type="create"
				/>
			</DashboardBody>
		</div>
	);
};

export default CreatePocketPage;

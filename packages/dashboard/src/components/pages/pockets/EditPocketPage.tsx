import { useNavigate, useParams } from '@tanstack/react-router';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import NotFoundPocket from '@/components/parts/pocket/NotFoundPocket';
import PocketForm from '@/components/parts/pocket/PocketForm';
import QueryHandling from '@/components/parts/query/QueryHandling';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import type { UpdatePocketPayload } from '@/endpoints/pocket/types';
import { useGetPocketByIdQuery, useUpdatePocketMutation } from '@/query/pocket';

const EditPocketPage = () => {
	const { id } = useParams({ from: '/_authed/pockets/$id/edit' });
	const navigate = useNavigate();
	const getPocketQuery = useGetPocketByIdQuery(id);
	const updateMutation = useUpdatePocketMutation();

	const handleSubmit = async (values: UpdatePocketPayload) => {
		try {
			await updateMutation.mutateAsync({ id, payload: values });
			toast.success('Pocket updated successfully');
			navigate({ to: '/pockets', replace: true });
		} catch (error) {
			if (isAxiosError(error)) {
				toast.error(error.response?.data.message);
			} else {
				toast.error('Failed to update pocket');
			}
		}
	};

	return (
		<div>
			<DashboardStickyHeader>
				<PageTitle title="Edit Pocket" backTo="/pockets" />
			</DashboardStickyHeader>

			<DashboardBody>
				<QueryHandling
					queryResult={getPocketQuery}
					renderLoading={<Skeleton className="h-100 w-full rounded-xl" />}
					renderNotFound={<NotFoundPocket />}
					render={({ data }) => {
						const pocket = data.data;

						return (
							<PocketForm
								initialValues={{
									name: pocket.name,
									icon: pocket.icon,
									color: pocket.color,
									type: pocket.type,
								}}
								onSubmit={handleSubmit}
								isSubmitting={updateMutation.isPending}
								submitText="Update Pocket"
								submitTextLoading="Updating..."
								type="update"
							/>
						);
					}}
				/>
			</DashboardBody>
		</div>
	);
};

export default EditPocketPage;

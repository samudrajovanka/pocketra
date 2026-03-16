import { useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import NotFoundPocket from '@/components/parts/pocket/NotFoundPocket';
import PocketCard from '@/components/parts/pocket/PocketCard';
import PocketCardLoading from '@/components/parts/pocket/PocketCardLoading';
import PocketDetailActions from '@/components/parts/pocket/PocketDetailActions';
import QueryHandling from '@/components/parts/query/QueryHandling';
import TransactionFilters from '@/components/parts/transaction/TransactionFilters';
import TransactionList from '@/components/parts/transaction/TransactionList';
import PageTitle from '@/components/ui/page-title';
import { useGetPocketByIdQuery } from '@/query/pocket';
import useTransactionFiltersStore from '@/store/transactionFiltersStore';

const PocketDetailPage = () => {
	const { id } = useParams({ from: '/_authed/pockets/$id/' });
	const pocketQuery = useGetPocketByIdQuery(id);
	const { setFilters, resetFilters } = useTransactionFiltersStore();

	useEffect(() => {
		setFilters({ pocketId: id });

		return () => {
			resetFilters();
		};
	}, [id, setFilters, resetFilters]);

	return (
		<div>
			<DashboardStickyHeader>
				<PageTitle title="Pocket Detail" />
			</DashboardStickyHeader>

			<DashboardBody containerClassName="space-y-6">
				<QueryHandling
					queryResult={pocketQuery}
					renderLoading={<PocketCardLoading />}
					renderNotFound={<NotFoundPocket />}
					render={({ data }) => {
						const pocket = data.data;

						return (
							<PocketCard
								pocket={pocket}
								actionComponent={
									<PocketDetailActions
										pocket={pocket}
										className="justify-center @max-lg/pocket:w-full @min-lg/pocket:w-fit"
									/>
								}
							/>
						);
					}}
				/>

				<div className="space-y-4">
					<h2 className="typography-subheading-2">Transactions</h2>

					<TransactionFilters hideFilter={{ pocket: true }} />

					<TransactionList hidePocketName from="detail_pocket" />
				</div>
			</DashboardBody>
		</div>
	);
};

export default PocketDetailPage;

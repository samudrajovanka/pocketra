import { Link, useParams } from '@tanstack/react-router';
import { useEffect } from 'react';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import PocketAction from '@/components/parts/pocket/PocketAction';
import QueryHandling from '@/components/parts/query/QueryHandling';

import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPocketByIdQuery } from '@/query/pocket';
import NotFoundPocket from '@/components/parts/pocket/NotFoundPocket';
import TransactionList from '@/components/parts/transaction/TransactionList';
import TransactionFilters from '@/components/parts/transaction/TransactionFilters';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
		<div className="space-y-6">
			<HeaderDashboardInset>
				<PageTitle title="Pocket Detail" backTo="/pockets" />
			</HeaderDashboardInset>

			<QueryHandling
				queryResult={pocketQuery}
				renderLoading={<Skeleton className="h-20 w-full" />}
				renderNotFound={<NotFoundPocket />}
				render={({ data }) => {
					const pocket = data.data;

					return (
						<div className="flex items-start justify-between">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-primary/10 rounded-full size-16 grid place-items-center">
									<span className="text-3xl">{pocket.icon}</span>
								</div>

								<h2 className="text-subheading">{pocket.name}</h2>
							</div>

							<div className="flex gap-3">
								<Button asChild>
									<Link
										to="/transactions/new"
										search={{
											pocket_id: pocket.id,
											back_to: `/pockets/${pocket.id}`,
											navigate_after_create: 'selected-pocket',
										}}
									>
										<Plus />
										Add Transaction
									</Link>
								</Button>
								<PocketAction pocket={pocket} />
							</div>
						</div>
					);
				}}
			/>

			<div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
				<h2 className="text-subheading-2">Transactions</h2>

				<TransactionFilters hideFilter={{ pocket: true }} />

				<TransactionList />
			</div>
		</div>
	);
};

export default PocketDetailPage;

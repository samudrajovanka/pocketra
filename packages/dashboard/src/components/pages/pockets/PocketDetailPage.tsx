import { Link, useParams } from '@tanstack/react-router';
import { ArrowUp, Plus } from 'lucide-react';
import { useEffect } from 'react';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import NotFoundPocket from '@/components/parts/pocket/NotFoundPocket';
import PocketAction from '@/components/parts/pocket/PocketAction';
import QueryHandling from '@/components/parts/query/QueryHandling';
import TransactionFilters from '@/components/parts/transaction/TransactionFilters';
import TransactionList from '@/components/parts/transaction/TransactionList';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
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
		<div className="space-y-6">
			<HeaderDashboardInset>
				<PageTitle title="Pocket Detail" />
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

								<h2 className="typography-subheading">{pocket.name}</h2>
							</div>

							<div className="flex gap-3">
								<PocketAction pocket={pocket} />
								<Button variant="outline" asChild>
									<Link
										to="/transactions/new"
										search={{
											method: 'transfer',
											from_pocket_id: pocket.id,
											from: 'detail_pocket',
										}}
									>
										<ArrowUp />
										Transfer
									</Link>
								</Button>
								<Button asChild>
									<Link
										to="/transactions/new"
										search={{
											pocket_id: pocket.id,
											from: 'detail_pocket',
										}}
									>
										<Plus />
										Transaction
									</Link>
								</Button>
							</div>
						</div>
					);
				}}
			/>

			<div className="space-y-4 p-4 bg-muted/50 rounded-lg border">
				<h2 className="typography-subheading-2">Transactions</h2>

				<TransactionFilters hideFilter={{ pocket: true }} />

				<TransactionList hidePocketName />
			</div>
		</div>
	);
};

export default PocketDetailPage;

import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import EmptyPocket from '@/components/parts/pocket/EmptyPocket';
import PocketCard from '@/components/parts/pocket/PocketCard';
import PocketListLoading from '@/components/parts/pocket/PocketListLoading';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/lib/formatter/number';
import { useGetPocketsQuery, useGetTotalBalanceQuery } from '@/query/pocket';

const PocketListPage = () => {
	const pocketsQuery = useGetPocketsQuery();
	const totalBalanceQuery = useGetTotalBalanceQuery();

	return (
		<div className="space-y-4">
			<HeaderDashboardInset>
				<PageTitle title="Pockets" noBack>
					<Button asChild>
						<Link to="/pockets/new">
							<Plus /> Add Pocket
						</Link>
					</Button>
				</PageTitle>
			</HeaderDashboardInset>

			<div className="bg-muted/50 p-4 rounded-lg border">
				<p className="text-small font-medium text-muted-foreground">
					Total Balance
				</p>
				<QueryHandling
					queryResult={totalBalanceQuery}
					renderLoading={<Skeleton className="h-8 w-48 mt-1" />}
					render={(response) => (
						<p className="text-subheading">
							{formatCurrency(Number(response.data.data.totalBalance ?? 0))}
						</p>
					)}
				/>
			</div>

			<QueryHandling
				queryResult={pocketsQuery}
				renderLoading={<PocketListLoading />}
				checkEmpty={(response) => response.data.data.length === 0}
				renderEmpty={<EmptyPocket />}
				render={(response) => (
					<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
						{response.data.data.map((pocket) => (
							<div key={pocket.id}>
								<PocketCard pocket={pocket} />
							</div>
						))}
					</div>
				)}
			/>
		</div>
	);
};

export default PocketListPage;

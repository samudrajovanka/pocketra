import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import EmptyPocket from '@/components/parts/pocket/EmptyPocket';
import PocketCard from '@/components/parts/pocket/PocketCard';
import PocketCardLoading from '@/components/parts/pocket/PocketCardLoading';
import TotalBalanceCard from '@/components/parts/pocket/TotalBalanceCard';
import TotalBalanceCardLoading from '@/components/parts/pocket/TotalBalanceCardLoading';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';
import { useGetPocketsQuery, useGetTotalBalanceQuery } from '@/query/pocket';

const PocketListPage = () => {
	const pocketsQuery = useGetPocketsQuery();
	const totalBalanceQuery = useGetTotalBalanceQuery();

	return (
		<div>
			<DashboardStickyHeader>
				<PageTitle title="Pockets" noBack>
					<Button asChild>
						<Link to="/pockets/new">
							<Plus /> Add Pocket
						</Link>
					</Button>
				</PageTitle>
			</DashboardStickyHeader>

			<DashboardBody containerClassName="space-y-6">
				<QueryHandling
					queryResult={totalBalanceQuery}
					renderLoading={<TotalBalanceCardLoading />}
					render={({ data }) => (
						<TotalBalanceCard balance={data.data.totalBalance} />
					)}
				/>

				<QueryHandling
					queryResult={pocketsQuery}
					renderLoading={
						<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
							{[...Array(3)].map((_, i) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: use index key
								<PocketCardLoading key={i} />
							))}
						</div>
					}
					checkEmpty={(response) => response.data.data.length === 0}
					renderEmpty={<EmptyPocket />}
					render={(response) => (
						<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
							{response.data.data.map((pocket) => (
								<Link
									key={pocket.id}
									to="/pockets/$id"
									params={{ id: pocket.id }}
									className="block h-full group/pocket-card"
								>
									<PocketCard pocket={pocket} />
								</Link>
							))}
						</div>
					)}
				/>
			</DashboardBody>
		</div>
	);
};

export default PocketListPage;

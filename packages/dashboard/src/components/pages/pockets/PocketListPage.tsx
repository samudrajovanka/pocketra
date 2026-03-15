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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';
import { POCKET_TYPE_LABELS } from '@/lib/constants/pockets';
import { groupPocketsByType } from '@/lib/helpers/pocket';
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
					render={(response) => {
						const pockets = response.data.data;
						const groupedPockets = groupPocketsByType(pockets);

						return (
							<div className="space-y-6">
								{Object.entries(groupedPockets).map(([type, typePockets]) => (
									<div key={type} className="space-y-2">
										<Badge variant="secondary" className="typography-small">
											{POCKET_TYPE_LABELS[
												type as keyof typeof POCKET_TYPE_LABELS
											] || 'Other'}
										</Badge>
										<div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
											{typePockets.map((pocket) => (
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
									</div>
								))}
							</div>
						);
					}}
				/>
			</DashboardBody>
		</div>
	);
};

export default PocketListPage;

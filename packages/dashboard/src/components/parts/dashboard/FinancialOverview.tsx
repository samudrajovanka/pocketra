import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import PocketCard from '@/components/parts/pocket/PocketCard';
import PocketCardAdd from '@/components/parts/pocket/PocketCardAdd';
import PocketCardLoading from '@/components/parts/pocket/PocketCardLoading';
import TotalBalanceCard from '@/components/parts/pocket/TotalBalanceCard';
import TotalBalanceCardLoading from '@/components/parts/pocket/TotalBalanceCardLoading';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Button } from '@/components/ui/button';
import { useGetPocketsQuery, useGetTotalBalanceQuery } from '@/query/pocket';

export default function FinancialOverview() {
	const getTotalBalanceQuery = useGetTotalBalanceQuery();
	const getPocketsQuery = useGetPocketsQuery({
		params: {
			limit: 2,
			sortBy: 'balance',
		},
	});

	return (
		<div className="grid grid-cols-1 @xl/dashboard:grid-cols-2 gap-4">
			<QueryHandling
				queryResult={getTotalBalanceQuery}
				renderLoading={<TotalBalanceCardLoading />}
				render={({ data }) => (
					<TotalBalanceCard balance={data.data.totalBalance} />
				)}
			/>

			<div className="space-y-1">
				<div className="flex items-center justify-between">
					<h2 className="typography-large font-medium">Top Pockets</h2>
					<Button asChild size="xs" variant="ghost">
						<Link to="/pockets">
							See All
							<ArrowRight />
						</Link>
					</Button>
				</div>

				<div className="grid grid-cols-2 gap-3 md:gap-4">
					<QueryHandling
						queryResult={getPocketsQuery}
						renderLoading={[...Array(2)].map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: use index
							<PocketCardLoading key={index} noIcon />
						))}
						checkEmpty={(response) => response.data.data.length === 0}
						renderEmpty={<PocketCardAdd />}
						render={(response) => (
							<>
								{response.data.data.map((pocket) => (
									<Link
										key={pocket.id}
										to="/pockets/$id"
										params={{ id: pocket.id }}
										className="group/pocket-card"
									>
										<PocketCard pocket={pocket} noIcon />
									</Link>
								))}
							</>
						)}
					/>
				</div>
			</div>
		</div>
	);
}

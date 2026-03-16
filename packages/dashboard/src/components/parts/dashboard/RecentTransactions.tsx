import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import QueryHandling from '@/components/parts/query/QueryHandling';
import EmptyTransaction from '@/components/parts/transaction/EmptyTransaction';
import TransactionItem from '@/components/parts/transaction/TransactionItem';
import TransactionItemLoading from '@/components/parts/transaction/TransactionItemLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTransactionsQuery } from '@/query/transaction';

export default function RecentTransactions() {
	const transactionsQuery = useGetTransactionsQuery({
		params: {
			limit: 5,
		},
	});

	return (
		<Card>
			<CardContent className="space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="typography-large font-medium">Recent Transactions</h2>

					<Button asChild size="xs" variant="ghost">
						<Link to="/transactions">
							See All
							<ArrowRight />
						</Link>
					</Button>
				</div>

				<QueryHandling
					queryResult={transactionsQuery}
					renderLoading={
						<div className="space-y-2">
							{[...Array(5)].map((_, index) => (
								// biome-ignore lint/suspicious/noArrayIndexKey: use index
								<TransactionItemLoading key={index} />
							))}
						</div>
					}
					checkEmpty={({ data }) => data.data.length === 0}
					renderEmpty={<EmptyTransaction />}
					render={({ data }) => (
						<div>
							{data.data.map((transaction) => (
								<Link
									key={transaction.id}
									to="/transactions/$id"
									params={{ id: transaction.id }}
									className="group/transaction-item"
								>
									<TransactionItem transaction={transaction} />
								</Link>
							))}
						</div>
					)}
				/>
			</CardContent>
		</Card>
	);
}

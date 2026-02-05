import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import MetrixCard from '@/components/parts/card/MetrixCard';
import PocketCard from '@/components/parts/pocket/PocketCard';
import PocketCardAdd from '@/components/parts/pocket/PocketCardAdd';
import PocketCardLoading from '@/components/parts/pocket/PocketCardLoading';
import TotalBalanceCard from '@/components/parts/pocket/TotalBalanceCard';
import TotalBalanceCardLoading from '@/components/parts/pocket/TotalBalanceCardLoading';
import QueryHandling from '@/components/parts/query/QueryHandling';
import TransactionItem from '@/components/parts/transaction/TransactionItem';
import TransactionItemLoading from '@/components/parts/transaction/TransactionItemLoading';
import { Button } from '@/components/ui/button';
import { useGetPocketsQuery, useGetTotalBalanceQuery } from '@/query/pocket';
import { useGetReportSummaryQuery } from '@/query/report';
import { useGetTransactionsQuery } from '@/query/transaction';

export default function DashboardPage() {
	const getTotalBalanceQuery = useGetTotalBalanceQuery();
	const getPocketsQuery = useGetPocketsQuery({
		params: {
			limit: 2,
		},
	});
	const summaryQuery = useGetReportSummaryQuery();
	const transactionsQuery = useGetTransactionsQuery({
		params: {
			limit: 5,
		},
	});

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-6">
				<div className="flex flex-col gap-4 p-4 bg-muted rounded-lg">
					<QueryHandling
						queryResult={getTotalBalanceQuery}
						renderLoading={<TotalBalanceCardLoading />}
						render={({ data }) => (
							<TotalBalanceCard balance={data.data.totalBalance} />
						)}
					/>

					<div className="space-y-1">
						<div className="flex items-center justify-between">
							<h2 className="typography-large font-medium">Pockets</h2>
							<Button asChild size="xs" variant="ghost">
								<Link to="/pockets">
									See All
									<ArrowRight />
								</Link>
							</Button>
						</div>

						<QueryHandling
							queryResult={getPocketsQuery}
							renderLoading={
								<div className="grid grid-cols-2 gap-4">
									{[...Array(2)].map((_, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: use index
										<PocketCardLoading key={index} size="small" />
									))}
								</div>
							}
							checkEmpty={(response) => response.data.data.length === 0}
							renderEmpty={<PocketCardAdd size="small" />}
							render={(response) => (
								<div className="grid grid-cols-2 gap-4">
									{response.data.data.map((pocket) => (
										<Link
											key={pocket.id}
											to="/pockets/$id"
											params={{ id: pocket.id }}
											className="group/pocket-card"
										>
											<PocketCard pocket={pocket} noIcon size="small" />
										</Link>
									))}
								</div>
							)}
						/>
					</div>
				</div>

				<QueryHandling
					queryResult={summaryQuery}
					render={({ data }) => (
						<div className="bg-muted rounded-lg p-4 grid grid-cols-2 gap-4">
							<MetrixCard
								variant="transaction"
								title="Income"
								amount={Number(data.data.income)}
								type="income"
							/>
							<MetrixCard
								variant="transaction"
								title="Expense"
								amount={Number(data.data.expense)}
								type="expense"
							/>
							<MetrixCard
								variant="transaction"
								title="Net"
								amount={Number(data.data.net)}
								type="income"
								className="col-span-2"
							/>
						</div>
					)}
				/>
			</div>

			<div className="grid grid-cols-3 gap-6">
				<div className="space-y-4 p-4 bg-muted rounded-lg col-span-2">
					<div className="flex items-center justify-between">
						<h2 className="typography-large font-medium">
							Recent Transactions
						</h2>

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
				</div>

				<div className="p-4 bg-muted rounded-lg">asdasd</div>
			</div>
		</div>
	);
}

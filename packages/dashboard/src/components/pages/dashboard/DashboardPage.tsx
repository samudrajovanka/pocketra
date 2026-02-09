import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';
import MetrixCard from '@/components/parts/card/MetrixCard';
import MetrixCardLoading from '@/components/parts/card/MetrixCardLoading';
import PocketCard from '@/components/parts/pocket/PocketCard';
import PocketCardAdd from '@/components/parts/pocket/PocketCardAdd';
import PocketCardLoading from '@/components/parts/pocket/PocketCardLoading';
import TotalBalanceCard from '@/components/parts/pocket/TotalBalanceCard';
import TotalBalanceCardLoading from '@/components/parts/pocket/TotalBalanceCardLoading';
import QueryHandling from '@/components/parts/query/QueryHandling';
import EmptyTransaction from '@/components/parts/transaction/EmptyTransaction';
import TransactionItem from '@/components/parts/transaction/TransactionItem';
import TransactionItemLoading from '@/components/parts/transaction/TransactionItemLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { REPORT_PERIOD } from '@/lib/constants/report';
import { getGrowthTooltipMessage } from '@/lib/helpers/report';
import { useGetPocketsQuery, useGetTotalBalanceQuery } from '@/query/pocket';
import { useGetReportSummaryQuery } from '@/query/report';
import { useGetTransactionsQuery } from '@/query/transaction';
import { ExpenseByCategoryChart } from '../../parts/charts/ExpenseByCategoryChart';
import { ExpenseByPocketChart } from '../../parts/charts/ExpenseByPocketChart';

export default function DashboardPage() {
	const getTotalBalanceQuery = useGetTotalBalanceQuery();
	const getPocketsQuery = useGetPocketsQuery({
		params: {
			limit: 2,
			sortBy: 'balance',
		},
	});

	const period = REPORT_PERIOD.month_to_date;
	const summaryQuery = useGetReportSummaryQuery({
		period,
	});
	const transactionsQuery = useGetTransactionsQuery({
		params: {
			limit: 5,
		},
	});

	return (
		<div className="space-y-6">
			<div className="space-y-6">
				<div className="grid grid-cols-2 gap-4">
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

						<div className="grid grid-cols-2 gap-4">
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

				<div className="grid grid-cols-3 gap-4">
					<QueryHandling
						queryResult={summaryQuery}
						renderLoading={[...Array(3)].map((_, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: use index
							<MetrixCardLoading key={idx} />
						))}
						render={({ data }) => (
							<>
								<MetrixCard
									variant="transaction"
									title="Income"
									amount={Number(data.data.income.value)}
									growth={data.data.income.growthPercent}
									tooltipGrowthMessage={getGrowthTooltipMessage(period)}
									type="income"
								/>
								<MetrixCard
									variant="transaction"
									title="Expense"
									amount={Number(data.data.expense.value)}
									growth={data.data.expense.growthPercent}
									tooltipGrowthMessage={getGrowthTooltipMessage(period)}
									type="expense"
								/>
								<MetrixCard
									variant="transaction"
									title="Net"
									amount={Number(data.data.net.value)}
									growth={data.data.net.growthPercent}
									tooltipGrowthMessage={getGrowthTooltipMessage(period)}
									type={Number(data.data.net.value) > 0 ? 'income' : 'expense'}
								/>
							</>
						)}
					/>
				</div>
			</div>

			<div className="gap-4 grid grid-cols-2">
				<ExpenseByPocketChart period={period} />
				<ExpenseByCategoryChart period={period} />
			</div>

			<Card>
				<CardContent className="space-y-4">
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
		</div>
	);
}

import { Link } from '@tanstack/react-router';
import { format, isSameMonth } from 'date-fns';
import QueryHandling from '@/components/parts/query/QueryHandling';
import EmptyTransaction from '@/components/parts/transaction/EmptyTransaction';
import TransactionItem from '@/components/parts/transaction/TransactionItem';
import TransactionItemLoading from '@/components/parts/transaction/TransactionItemLoading';
import { Card, CardContent } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll';
import { useGetInfiniteTransactionsQuery } from '@/query/transaction';
import useTransactionFiltersStore from '@/store/transactionFiltersStore';

type TransactionListProps = {
	hidePocketName?: boolean;
};

const TransactionList = ({ hidePocketName }: TransactionListProps) => {
	const { filters } = useTransactionFiltersStore();
	const transactionsQuery = useGetInfiniteTransactionsQuery({
		params: filters,
	});
	const { fetchNextPage, hasNextPage, isFetchingNextPage } = transactionsQuery;

	const observerTarget = useInfiniteScroll({
		hasNextPage,
		fetchNextPage,
	});

	return (
		<div className="flex flex-col gap-4">
			<QueryHandling
				queryResult={transactionsQuery}
				checkEmpty={(data) => data.pages[0].data.data.length === 0}
				renderEmpty={<EmptyTransaction />}
				renderLoading={
					<div className="space-y-2">
						{[...Array(5)].map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: use index
							<TransactionItemLoading key={index} />
						))}
					</div>
				}
				render={(data) => {
					const allTransactions = data.pages.flatMap((page) => page.data.data);

					const groupedTransactions = allTransactions.reduce(
						(groups, transaction) => {
							const date = new Date(transaction.date);
							const key = format(date, 'MMMM yyyy');
							if (!groups[key]) {
								groups[key] = [];
							}
							groups[key].push(transaction);
							return groups;
						},
						{} as Record<string, typeof allTransactions>,
					);

					const sortedGroupedTransactions = Object.entries(
						groupedTransactions,
					).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime());

					return (
						<div className="space-y-4">
							{sortedGroupedTransactions.map(([key, transactions]) => (
								<div key={key} className="space-y-2">
									<h3 className="typography-small font-medium text-muted-foreground">
										{isSameMonth(new Date(key), new Date())
											? 'This Month'
											: key}
									</h3>
									<Card data-card-size="small">
										<CardContent>
											{transactions.map((transaction) => (
												<Link
													key={transaction.id}
													to="/transactions/$id"
													params={{ id: transaction.id }}
													className="block group/transaction-item"
												>
													<TransactionItem
														transaction={transaction}
														hidePocketName={hidePocketName}
													/>
												</Link>
											))}
										</CardContent>
									</Card>
								</div>
							))}
						</div>
					);
				}}
			/>

			{(hasNextPage || isFetchingNextPage) && (
				<div ref={observerTarget} className="flex justify-center p-4">
					{isFetchingNextPage && <Spinner />}
				</div>
			)}
		</div>
	);
};

export default TransactionList;

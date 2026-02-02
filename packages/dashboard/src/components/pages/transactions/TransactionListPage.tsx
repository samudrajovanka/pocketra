import { Link } from '@tanstack/react-router';
import { format, isSameMonth } from 'date-fns';
import { Loader2, Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import QueryHandling from '@/components/parts/query/QueryHandling';
import EmptyTransaction from '@/components/parts/transaction/EmptyTransaction';
import TransactionFilters from '@/components/parts/transaction/TransactionFilters';
import TransactionItem from '@/components/parts/transaction/TransactionItem';
import TransactionListLoading from '@/components/parts/transaction/TransactionListLoading';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';
import { useGetInfiniteTransactionsQuery } from '@/query/transaction';
import useTransactionFiltersStore from '@/store/transactionFiltersStore';

const TransactionListPage = () => {
	const { filters } = useTransactionFiltersStore();
	const transactionsQuery = useGetInfiniteTransactionsQuery(filters);
	const { fetchNextPage, hasNextPage, isFetchingNextPage } = transactionsQuery;
	const observerTarget = useRef(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1.0 },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [hasNextPage, fetchNextPage]);

	return (
		<div className="space-y-6">
			<HeaderDashboardInset>
				<PageTitle title="Transactions" noBack>
					<Button asChild>
						<Link to="/transactions/new">
							<Plus /> Add Transaction
						</Link>
					</Button>
				</PageTitle>

				<TransactionFilters />
			</HeaderDashboardInset>

			<div className="flex flex-col gap-4">
				<QueryHandling
					queryResult={transactionsQuery}
					checkEmpty={(data) => data.pages[0].data.data.length === 0}
					renderEmpty={<EmptyTransaction />}
					renderLoading={<TransactionListLoading />}
					render={(data) => {
						const allTransactions = data.pages.flatMap(
							(page) => page.data.data,
						);

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
						).sort(
							(a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
						);

						return (
							<div className="space-y-6">
								{sortedGroupedTransactions.map(([key, transactions]) => (
									<div key={key} className="space-y-2">
										<h3 className="text-sm font-medium text-muted-foreground">
											{isSameMonth(new Date(key), new Date())
												? 'This Month'
												: key}
										</h3>
										<div className="space-y-4 bg-muted/50 p-4 rounded-lg border">
											{transactions.map((transaction) => (
												<TransactionItem
													key={transaction.id}
													transaction={transaction}
												/>
											))}
										</div>
									</div>
								))}
							</div>
						);
					}}
				/>

				{(hasNextPage || isFetchingNextPage) && (
					<div ref={observerTarget} className="flex justify-center p-4">
						{isFetchingNextPage && <Loader2 className="animate-spin" />}
					</div>
				)}
			</div>
		</div>
	);
};

export default TransactionListPage;

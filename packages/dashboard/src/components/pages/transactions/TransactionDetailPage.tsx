import { Link, useParams, useSearch } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import QueryHandling from '@/components/parts/query/QueryHandling';
import DeleteTransactionDialog from '@/components/parts/transaction/DeleteTransactionDialog';
import NotFoundTransaction from '@/components/parts/transaction/NotFoundTransaction';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import TextTransaction from '@/components/ui/text-transaction';
import TransferBadge from '@/components/ui/transfer-badge';
import { TRANSACTION_TYPE_LABELS } from '@/lib/constants/transactions';
import { isEditableTransaction } from '@/lib/helpers/transactions';
import { useGetTransactionByIdQuery } from '@/query/transaction';

export default function TransactionDetailPage() {
	const { id } = useParams({ from: '/_authed/transactions/$id' });
	const search = useSearch({ from: '/_authed/transactions/$id/' });

	const getTransactionByIdQuery = useGetTransactionByIdQuery(id);

	return (
		<div>
			<HeaderDashboardInset>
				<PageTitle title="Transaction Detail" />
			</HeaderDashboardInset>

			<QueryHandling
				queryResult={getTransactionByIdQuery}
				renderLoading={<Skeleton className="h-50 w-full rounded-xl" />}
				renderNotFound={<NotFoundTransaction />}
				render={({ data }) => {
					const transaction = data.data;

					const isEditable = isEditableTransaction(transaction.createdAt);

					return (
						<div className="space-y-6">
							<Card>
								<CardHeader className="flex justify-between">
									<CardTitle className="typography-subheading">
										{transaction.description || 'No description'}
									</CardTitle>

									<div className="flex gap-2">
										{isEditable && (
											<Button
												asChild
												size="icon-sm"
												title="Edit"
												variant="outlineWarning"
											>
												<Link
													to="/transactions/$id/edit"
													params={{ id }}
													search={{
														from: search.from || undefined,
													}}
												>
													<Pencil />
												</Link>
											</Button>
										)}

										<DeleteTransactionDialog
											transactionId={transaction.id}
											pocketId={transaction.pocketId}
										>
											<Button
												variant="outlineDestructive"
												size="icon-sm"
												title="Delete"
											>
												<Trash2 />
											</Button>
										</DeleteTransactionDialog>
									</div>
								</CardHeader>
								<CardContent className="space-y-3">
									<div className="flex flex-col gap-0.5 py-1">
										<span className="typography-small text-muted-foreground">
											Amount
										</span>
										<TextTransaction
											amount={Number(transaction.amount)}
											type={transaction.type}
										/>
									</div>

									<div className="flex flex-col gap-0.5 py-1">
										<span className="typography-small text-muted-foreground">
											Type
										</span>
										<span className="capitalize typography-regular">
											{TRANSACTION_TYPE_LABELS[transaction.type]}
										</span>
									</div>

									<div className="flex flex-col gap-0.5 py-1">
										<span className="typography-small text-muted-foreground">
											Date
										</span>
										<span className="typography-regular">
											{format(new Date(transaction.date), 'dd MMMM yyyy')}
										</span>
									</div>

									<div className="flex flex-col gap-0.5 py-1">
										<span className="typography-small text-muted-foreground">
											Category
										</span>
										<div className="flex items-center gap-2">
											<span className="typography-regular">
												{transaction.category.name}
											</span>

											{transaction.relatedPocket && (
												<TransferBadge
													type={transaction.type}
													relatedPocketName={transaction.relatedPocket.name}
												/>
											)}
										</div>
									</div>

									<div className="flex flex-col gap-0.5 py-1">
										<span className="typography-small text-muted-foreground">
											Pocket
										</span>
										<span className="typography-regular">
											{transaction.pocket.name}
										</span>
									</div>

									<div className="flex flex-col gap-0.5 py-1">
										<span className="typography-small text-muted-foreground">
											Created at
										</span>
										<span className="typography-regular">
											{format(new Date(transaction.createdAt), 'dd MMMM yyyy')}
										</span>
									</div>
								</CardContent>
							</Card>
						</div>
					);
				}}
			/>
		</div>
	);
}

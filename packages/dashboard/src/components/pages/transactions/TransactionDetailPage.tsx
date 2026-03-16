import { Link, useParams, useSearch } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import QueryHandling from '@/components/parts/query/QueryHandling';
import DeleteTransactionDialog from '@/components/parts/transaction/DeleteTransactionDialog';
import NotFoundTransaction from '@/components/parts/transaction/NotFoundTransaction';
import TransactionInfo from '@/components/parts/transaction/TransactionInfo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PageTitle from '@/components/ui/page-title';
import { Skeleton } from '@/components/ui/skeleton';
import TextTransaction from '@/components/ui/text-transaction';
import TransferBadge from '@/components/ui/transfer-badge';
import { TRANSACTION_TYPE_LABELS } from '@/lib/constants/transactions';
import {
	isEditableTransaction,
	isTransferTransaction,
} from '@/lib/helpers/transactions';
import { useGetTransactionByIdQuery } from '@/query/transaction';
import type { TransactionType } from '@/types/transaction';

export default function TransactionDetailPage() {
	const { id } = useParams({ from: '/_authed/transactions/$id' });
	const search = useSearch({ from: '/_authed/transactions/$id/' });
	const [isShowDeleteDialog, setIsShowDeleteDialog] = useState(false);

	const getTransactionByIdQuery = useGetTransactionByIdQuery(id);

	return (
		<div>
			<DashboardStickyHeader>
				<PageTitle title="Transaction Detail" />
			</DashboardStickyHeader>

			<DashboardBody>
				<QueryHandling
					queryResult={getTransactionByIdQuery}
					renderLoading={<Skeleton className="h-50 w-full rounded-xl" />}
					renderNotFound={<NotFoundTransaction />}
					render={({ data }) => {
						const transaction = data.data;
						const isEditable = isEditableTransaction(transaction.createdAt);
						const isTransfer = isTransferTransaction(transaction);

						return (
							<>
								<div className="space-y-6">
									<Card>
										<CardHeader className="flex justify-between">
											<CardTitle className="typography-subheading">
												{transaction.description}
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
																method: transaction.type as Extract<
																	TransactionType,
																	'transfer_in' | 'transfer_out'
																>,
															}}
														>
															<Pencil />
														</Link>
													</Button>
												)}

												<Button
													variant="outlineDestructive"
													size="icon-sm"
													title="Delete"
													onClick={() => setIsShowDeleteDialog(true)}
												>
													<Trash2 />
												</Button>
											</div>
										</CardHeader>

										<CardContent className="space-y-3">
											<TransactionInfo title="Amount">
												<TextTransaction
													amount={Number(transaction.amount)}
													type={transaction.type}
												/>
											</TransactionInfo>

											<TransactionInfo title="Pocket">
												{transaction.pocket.name}
											</TransactionInfo>

											<TransactionInfo title="Type">
												{TRANSACTION_TYPE_LABELS[transaction.type]}
											</TransactionInfo>

											<TransactionInfo title="Date">
												{format(new Date(transaction.date), 'dd MMMM yyyy')}
											</TransactionInfo>

											<TransactionInfo title="Category">
												<div className="flex items-center gap-2">
													<span className="typography-regular">
														{transaction.category.name}
													</span>

													{isTransfer && (
														<TransferBadge
															type={transaction.type}
															relatedPocketName={transaction.relatedPocket.name}
														/>
													)}
												</div>
											</TransactionInfo>

											<TransactionInfo title="Created at">
												{format(
													new Date(transaction.createdAt),
													'dd MMMM yyyy',
												)}
											</TransactionInfo>
										</CardContent>
									</Card>
								</div>

								<DeleteTransactionDialog
									open={isShowDeleteDialog}
									onOpenChange={setIsShowDeleteDialog}
									transactionId={transaction.id}
									pocketId={transaction.pocketId}
								/>
							</>
						);
					}}
				/>
			</DashboardBody>
		</div>
	);
}

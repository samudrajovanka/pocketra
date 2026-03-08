import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import TextTransaction from '@/components/ui/text-transaction';
import TransferBadge from '@/components/ui/transfer-badge';
import type { Transaction } from '@/types/transaction';

type TransactionItemProps = {
	transaction: Transaction;
	hidePocketName?: boolean;
};

const TransactionItem = ({
	transaction,
	hidePocketName = false,
}: TransactionItemProps) => {
	return (
		<div className="@container/transaction-item">
			<div className="flex flex-col @md/transaction-item:flex-row @md/transaction-item:justify-between @md/transaction-item:items-center group-hover/transaction-item:bg-primary/5 p-2 rounded-lg">
				<div className="flex @md/transaction-item:flex-col items-center justify-between @md/transaction-item:items-end @md/transaction-item:order-last">
					<TextTransaction
						amount={Number(transaction.amount)}
						type={transaction.type}
					/>
					<p className="typography-xsmall text-muted-foreground">
						{format(transaction.date, 'dd MMM yyyy')}
					</p>
				</div>
				<div className="@md/transaction-item:order-first">
					<p className="typography-regular font-medium">
						{transaction.description}
					</p>
					<div className="mt-1 flex flex-wrap gap-2 items-center">
						{!hidePocketName && (
							<Badge variant="secondary">{transaction.pocket.name}</Badge>
						)}
						<Badge variant="outline">{transaction.category.name}</Badge>
						{transaction.relatedPocket && (
							<TransferBadge
								type={transaction.type}
								relatedPocketName={transaction.relatedPocket.name}
							/>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionItem;

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
		<div className="flex justify-between items-center group-hover/transaction-item:bg-primary/5 p-2 rounded-lg">
			<div>
				<p className="typography-regular font-medium">
					{transaction.description}
				</p>

				<div className="mt-1 flex gap-2 items-center">
					<p className="typography-xsmall text-muted-foreground">
						{format(transaction.date, 'dd MMM yyyy')}
					</p>
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
			<TextTransaction
				amount={Number(transaction.amount)}
				type={transaction.type}
			/>
		</div>
	);
};

export default TransactionItem;

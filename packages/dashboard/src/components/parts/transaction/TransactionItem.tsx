import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import TextTransaction from '@/components/ui/text-transaction';
import type { Transaction } from '@/types/transaction';

type TransactionItemProps = {
	transaction: Transaction;
};

const TransactionItem = ({ transaction }: TransactionItemProps) => {
	return (
		<Link
			to="/transactions/$id"
			params={{ id: transaction.id }}
			className="block"
		>
			<div className="flex justify-between items-center">
				<div>
					<p className="text-regular font-medium">{transaction.description}</p>

					<div className="mt-1 flex gap-2 items-center">
						<Badge variant="secondary">{transaction.pocket.name}</Badge>
						<Badge variant="outline">{transaction.category.name}</Badge>
						<p className="text-xsmall text-muted-foreground">
							{format(transaction.date, 'd MMM yyyy')}
						</p>
					</div>
				</div>
				<TextTransaction
					amount={Number(transaction.amount)}
					type={transaction.type}
				/>
			</div>
		</Link>
	);
};

export default TransactionItem;

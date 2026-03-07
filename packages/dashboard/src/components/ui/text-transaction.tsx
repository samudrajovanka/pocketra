import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/transaction';

type TextTransactionProps = {
	amount: number;
	type: TransactionType;
	className?: string;
	noSign?: boolean;
};

const INCOME_TYPES: TransactionType[] = ['income', 'transfer_in'];
const EXPENSE_TYPES: TransactionType[] = ['expense', 'transfer_out'];

const TextTransaction = ({
	amount,
	type,
	className,
	noSign,
}: TextTransactionProps) => {
	const isIncome = INCOME_TYPES.includes(type);
	const isExpense = EXPENSE_TYPES.includes(type);

	return (
		<p
			className={cn(
				'typography-regular font-semibold',
				{
					'text-green-500': isIncome,
					'text-red-500': isExpense,
				},
				className,
			)}
		>
			{!noSign && (isIncome ? '+' : '-')} {formatCurrency(amount)}
		</p>
	);
};

export default TextTransaction;

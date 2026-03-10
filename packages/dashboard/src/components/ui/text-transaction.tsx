import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/transaction';

type TextTransactionProps = {
	amount: number;
	type: TransactionType | 'netral';
	className?: string;
	noSign?: boolean;
	isNominalHidden?: boolean;
};

const INCOME_TYPES: TransactionType[] = ['income', 'transfer_in'];
const EXPENSE_TYPES: TransactionType[] = ['expense', 'transfer_out'];

const TextTransaction = ({
	amount,
	type,
	className,
	noSign,
	isNominalHidden,
}: TextTransactionProps) => {
	const isIncome = INCOME_TYPES.includes(type as TransactionType);
	const isExpense = EXPENSE_TYPES.includes(type as TransactionType);

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
			{!noSign && (isIncome ? '+' : '-')}{' '}
			{formatCurrency(amount, isNominalHidden)}
		</p>
	);
};

export default TextTransaction;

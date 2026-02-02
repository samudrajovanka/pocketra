import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/transaction';

type TextTransactionProps = {
	amount: number;
	type: TransactionType;
	className?: string;
};

const TextTransaction = ({ amount, type, className }: TextTransactionProps) => {
	return (
		<p
			className={cn(
				'text-regular font-semibold',
				{
					'text-green-500': type === 'income',
					'text-red-500': type === 'expense',
				},
				className,
			)}
		>
			{type === 'income' ? '+' : '-'}
			{formatCurrency(amount)}
		</p>
	);
};

export default TextTransaction;

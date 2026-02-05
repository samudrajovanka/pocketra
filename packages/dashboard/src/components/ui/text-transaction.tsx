import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';
import type { TransactionType } from '@/types/transaction';

type TextTransactionProps = {
	amount: number;
	type?: TransactionType;
	className?: string;
	noSign?: boolean;
};

const TextTransaction = ({
	amount,
	type,
	className,
	noSign,
}: TextTransactionProps) => {
	return (
		<p
			className={cn(
				'typography-regular font-semibold',
				{
					'text-green-500': type === 'income',
					'text-red-500': type === 'expense',
				},
				className,
			)}
		>
			{!noSign && (type === 'income' ? '+' : '-')} {formatCurrency(amount)}
		</p>
	);
};

export default TextTransaction;

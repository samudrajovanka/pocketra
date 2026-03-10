import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';

type TextCurrencyProps = {
	amount: number;
	className?: string;
	isNominalHidden?: boolean;
};

const TextCurrency = ({
	amount,
	className,
	isNominalHidden,
}: TextCurrencyProps) => {
	return (
		<p className={cn('typography-regular font-semibold', className)}>
			{formatCurrency(amount, isNominalHidden)}
		</p>
	);
};

export default TextCurrency;

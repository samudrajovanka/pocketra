import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';

type TotalBalanceCardProps = {
	balance: string;
	className?: string;
};

const TotalBalanceCard = ({ balance, className }: TotalBalanceCardProps) => {
	return (
		<Card
			className={cn(
				'flex-1 w-full bg-primary text-primary-foreground justify-between gap-4',
				className,
			)}
		>
			<CardHeader className="flex flex-row items-center">
				<Wallet className="size-4" />
				<CardTitle className="typography-regular font-medium">
					Total Balance
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="typography-heading">{formatCurrency(Number(balance))}</p>
			</CardContent>
		</Card>
	);
};

export default TotalBalanceCard;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TextTransaction from '@/components/ui/text-transaction';

type MetrixCardProps = {
	title: string;
	amount: number;
	type: 'income' | 'expense';
	variant?: 'transaction' | 'default';
	className?: string;
};

const MetrixCard = ({
	title,
	amount,
	type,
	variant = 'default',
	className,
}: MetrixCardProps) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="typography-large font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{variant === 'transaction' ? (
					<TextTransaction
						amount={amount}
						type={type}
						noSign
						className="typography-subheading"
					/>
				) : (
					<p>{amount}</p>
				)}
			</CardContent>
		</Card>
	);
};

export default MetrixCard;

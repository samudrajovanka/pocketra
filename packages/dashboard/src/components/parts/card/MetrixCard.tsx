import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GrowthPercentage from '@/components/ui/growth-percentage';
import TextTransaction from '@/components/ui/text-transaction';

type MetrixCardProps = {
	title: string;
	amount: number;
	type: 'income' | 'expense';
	variant?: 'transaction' | 'default';
	className?: string;
	growth?: number | null;
	tooltipGrowthMessage?: string;
};

const MetrixCard = ({
	title,
	amount,
	type,
	variant = 'default',
	className,
	growth,
	tooltipGrowthMessage,
}: MetrixCardProps) => {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="typography-large font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{variant === 'transaction' ? (
					<div className="flex flex-col items-start gap-1">
						<TextTransaction
							amount={amount}
							type={type}
							noSign
							className="typography-subheading"
						/>

						{growth !== undefined && (
							<GrowthPercentage
								value={growth}
								tooltipMessage={tooltipGrowthMessage}
								messageNullValue={
									growth === null
										? amount === 0
											? 'Start transactions to see growth'
											: 'No data for comparison growth'
										: 'No data for comparison growth'
								}
							/>
						)}
					</div>
				) : (
					<p>{amount}</p>
				)}
			</CardContent>
		</Card>
	);
};

export default MetrixCard;

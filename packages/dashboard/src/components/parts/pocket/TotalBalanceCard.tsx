import { Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TextCurrency from '@/components/ui/text-currency';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
import ToggleNominalButton from '../button/ToggleNominalButton';

type TotalBalanceCardProps = {
	balance: string;
	className?: string;
};

const TotalBalanceCard = ({ balance, className }: TotalBalanceCardProps) => {
	const { isNominalHidden } = useSettingsStore();

	return (
		<Card
			className={cn(
				'flex-1 w-full bg-primary text-primary-foreground justify-between gap-4',
				className,
			)}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex flex-row items-center space-x-2">
					<Wallet className="size-4" />
					<CardTitle className="typography-regular font-medium">
						Total Balance
					</CardTitle>
				</div>
				<ToggleNominalButton variant="ghostWhite" />
			</CardHeader>
			<CardContent>
				<TextCurrency
					amount={Number(balance)}
					isNominalHidden={isNominalHidden}
					className="typography-heading"
				/>
			</CardContent>
		</Card>
	);
};

export default TotalBalanceCard;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatter/number';
import type { Pocket } from '@/types/pocket';
import PocketCardAction from './PocketCardAction';

type PocketCardProps = {
	pocket: Pocket;
};

const PocketCard = ({ pocket }: PocketCardProps) => {
	const formattedBalance = formatCurrency(Number(pocket.currentBalance));

	return (
		<Card className="flex flex-col h-full relative group">
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="text-4xl flex items-center gap-2">
					{pocket.icon}
				</CardTitle>

				<PocketCardAction pocket={pocket} />
			</CardHeader>

			<CardContent className="flex-1">
				<p className="text-subheading">{pocket.name}</p>
				<div className="text-subheading font-medium">{formattedBalance}</div>
			</CardContent>
		</Card>
	);
};

export default PocketCard;

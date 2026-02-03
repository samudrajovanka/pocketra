import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatter/number';
import type { Pocket } from '@/types/pocket';

type PocketCardProps = {
	pocket: Pocket;
};

const PocketCard = ({ pocket }: PocketCardProps) => {
	const formattedBalance = formatCurrency(Number(pocket.currentBalance));

	return (
		<Link to="/pockets/$id" params={{ id: pocket.id }} className="block h-full">
			<Card className="flex flex-col h-full relative group hover:bg-muted/50 transition-colors">
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="text-4xl flex items-center gap-2">
						{pocket.icon}
					</CardTitle>
				</CardHeader>

				<CardContent className="flex-1">
					<p className="text-subheading">{pocket.name}</p>
					<div className="text-subheading font-medium">{formattedBalance}</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default PocketCard;

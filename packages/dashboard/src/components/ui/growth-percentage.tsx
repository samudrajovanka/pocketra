import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from './badge';
import { SimpleTooltip } from './tooltip';

type GrowthPercentageProps = {
	value: number | null;
	messageNullValue?: string;
	tooltipMessage?: string;
};

const GrowthPercentage = ({
	value,
	messageNullValue,
	tooltipMessage,
}: GrowthPercentageProps) => {
	const isUp = (value ?? 0) > 0;
	const isDown = (value ?? 0) < 0;

	const BadgeValue = () => (
		<Badge variant={isUp ? 'success' : isDown ? 'destructive' : 'secondary'}>
			{value === null ? (
				messageNullValue || '-'
			) : (
				<>
					{isUp ? '+' : '-'}
					{value ? Math.abs(value).toFixed(2) : '-'}
					{isUp || isDown ? '% ' : ''}
					{isUp ? <TrendingUp /> : <TrendingDown />}
				</>
			)}
		</Badge>
	);

	if (!tooltipMessage) {
		return <BadgeValue />;
	}

	return (
		<SimpleTooltip content={tooltipMessage}>
			<BadgeValue />
		</SimpleTooltip>
	);
};

export default GrowthPercentage;

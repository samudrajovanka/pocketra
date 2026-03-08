import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { formatCurrency } from '@/lib/formatter/number';
import { cn } from '@/lib/utils';
import type { Pocket } from '@/types/pocket';

type PocketCardProps = {
	pocket: Pocket;
	noIcon?: boolean;
	className?: string;
	size?: 'regular' | 'small';
	actionComponent?: React.ReactNode;
};

const PocketCard = ({
	pocket,
	noIcon,
	className,
	size = 'regular',
	actionComponent,
}: PocketCardProps) => {
	const formattedBalance = formatCurrency(Number(pocket.currentBalance));

	return (
		<Card
			className={cn(
				'flex flex-col h-full relative group-hover/pocket-card:border-primary/50 group-hover/pocket-card:shadow-sm transition-all duration-300 gap-4 @container/pocket',
				className,
				{
					'p-3': size === 'small',
				},
			)}
		>
			{!noIcon && (
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="w-full text-4xl flex items-center justify-between gap-2">
						{pocket.icon}

						{actionComponent && (
							<div className="@max-lg/pocket:hidden">{actionComponent}</div>
						)}
					</CardTitle>
				</CardHeader>
			)}

			<CardContent
				className={cn('flex-1 space-y-0.5', {
					'px-3': size === 'small',
				})}
			>
				<p
					className={cn('font-medium text-muted-foreground', {
						'typography-large': size === 'regular',
						'typography-small': size === 'small',
					})}
				>
					{pocket.name}
				</p>
				<p
					className={cn('font-bold', {
						'typography-regular': size === 'regular',
						'typography-small': size === 'small',
					})}
				>
					{formattedBalance}
				</p>
			</CardContent>

			{actionComponent && (
				<CardFooter className="@lg/pocket:hidden">{actionComponent}</CardFooter>
			)}
		</Card>
	);
};

export default PocketCard;

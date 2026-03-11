import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import TextCurrency from '@/components/ui/text-currency';
import { POCKET_TYPE_LABELS } from '@/lib/constants/pockets';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/settingsStore';
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
	const isNominalHidden = useSettingsStore((state) => state.isNominalHidden);

	return (
		<Card
			className={cn(
				'flex flex-col h-full relative group-hover/pocket-card:border-primary/50 group-hover/pocket-card:shadow-sm transition-all duration-300 gap-4 @container/pocket',
				className,
				{
					'p-3': size === 'small',
					'bg-(--pocket-bg) border-(--pocket-border)': pocket.color,
				},
			)}
			style={
				pocket.color
					? ({
							'--pocket-bg': pocket.color,
							'--pocket-border': `hsl(from ${pocket.color} h s calc(l - 5))`,
						} as React.CSSProperties)
					: undefined
			}
		>
			{!noIcon && (
				<CardHeader className="flex flex-row items-center justify-between">
					<CardTitle className="w-full text-4xl flex items-center justify-between gap-2">
						<span>{pocket.icon}</span>

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
						'text-(--pocket-text-color)': pocket.color,
					})}
					style={
						pocket.color
							? ({
									'--pocket-text-color': `hsl(from ${pocket.color} h s calc(l - 60))`,
								} as React.CSSProperties)
							: undefined
					}
				>
					{pocket.name}
				</p>
				<TextCurrency
					amount={Number(pocket.currentBalance)}
					isNominalHidden={isNominalHidden}
					className={cn('font-bold', {
						'typography-regular': size === 'regular',
						'typography-small': size === 'small',
					})}
				/>
				<p
					className={cn(
						'absolute @max-lg/pocket:top-2 @lg/pocket:bottom-2 right-4 typography-xsmall text-muted-foreground text-right',
						{
							'text-(--pocket-text-color)': pocket.color,
						},
					)}
					style={
						pocket.color
							? ({
									'--pocket-text-color': `hsl(from ${pocket.color} h s calc(l - 60))`,
								} as React.CSSProperties)
							: undefined
					}
				>
					{POCKET_TYPE_LABELS[pocket.type]}
				</p>
			</CardContent>

			{actionComponent && (
				<CardFooter className="@lg/pocket:hidden">{actionComponent}</CardFooter>
			)}
		</Card>
	);
};

export default PocketCard;

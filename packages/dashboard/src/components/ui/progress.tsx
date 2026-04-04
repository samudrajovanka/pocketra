import { Progress as ProgressPrimitive } from 'radix-ui';
import type * as React from 'react';

import { cn } from '@/lib/utils';

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
	indicatorClassName?: string;
};

function Progress({
	className,
	value,
	indicatorClassName,
	...props
}: ProgressProps) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				'relative h-2 w-full overflow-hidden rounded-full bg-primary/20',
				className,
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className={cn(
					'h-full w-full flex-1 bg-primary transition-all',
					indicatorClassName,
				)}
				style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
			/>
		</ProgressPrimitive.Root>
	);
}

function ProgressWithThreshold({
	threshold,
	className,
	progressProps,
}: {
	progressProps: ProgressProps;
	className?: string;
	threshold: number;
}) {
	return (
		<div className={cn('relative', className)}>
			<Progress {...progressProps} />

			<div
				className="absolute top-0 h-full w-0.5 bg-amber-500/60"
				style={{ left: `${threshold * 100}%` }}
			/>
		</div>
	);
}

export { Progress, ProgressWithThreshold };

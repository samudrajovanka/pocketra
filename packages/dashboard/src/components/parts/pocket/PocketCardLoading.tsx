import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type PocketCardLoadingProps = {
	size?: 'small' | 'regular';
	noIcon?: boolean;
};

const PocketCardLoading = ({
	size = 'regular',
	noIcon,
}: PocketCardLoadingProps) => {
	return (
		<Skeleton
			className={cn('w-full rounded-xl', {
				'h-40': size === 'regular' && !noIcon,
				'h-28': size === 'regular' && noIcon,
				'h-18': size === 'small',
			})}
		/>
	);
};

export default PocketCardLoading;

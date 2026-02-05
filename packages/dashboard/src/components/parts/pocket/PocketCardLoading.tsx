import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type PocketCardLoadingProps = {
	size?: 'small' | 'regular';
};

const PocketCardLoading = ({ size = 'regular' }: PocketCardLoadingProps) => {
	return (
		<Skeleton
			className={cn('w-full rounded-xl', {
				'h-40': size === 'regular',
				'h-18': size === 'small',
			})}
		/>
	);
};

export default PocketCardLoading;

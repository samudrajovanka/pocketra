import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

type PocketCardAddProps = {
	size?: 'regular' | 'small';
};

const PocketCardAdd = ({ size = 'regular' }: PocketCardAddProps) => {
	return (
		<Link to="/pockets/new">
			<div
				className={cn(
					'w-full border border-dashed border-primary hover:bg-primary/10 rounded-xl flex items-center justify-center gap-1 text-primary',
					{
						'h-40': size === 'regular',
						'h-18': size === 'small',
					},
				)}
			>
				<Plus className="size-4" />
				<p className="typography-regular">Add Pocket</p>
			</div>
		</Link>
	);
};

export default PocketCardAdd;

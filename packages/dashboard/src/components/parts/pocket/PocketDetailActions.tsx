import { Link } from '@tanstack/react-router';
import { ArrowUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import PocketAction from './PocketAction';
import { Pocket } from '@/types/pocket';

type PocketDetailActionsProps = {
	pocket: Pocket;
	className?: string;
};

const PocketDetailActions = ({
	pocket,
	className,
}: PocketDetailActionsProps) => {
	return (
		<div className={cn('flex gap-3', className)}>
			<PocketAction pocket={pocket} />
			<Button variant="outline" asChild className="flex-1 md:flex-none">
				<Link
					to="/transactions/new"
					search={{
						method: 'transfer',
						from_pocket_id: pocket.id,
						from: 'detail_pocket',
					}}
				>
					<ArrowUp />
					Transfer
				</Link>
			</Button>
			<Button asChild className="flex-1 md:flex-none">
				<Link
					to="/transactions/new"
					search={{
						pocket_id: pocket.id,
						from: 'detail_pocket',
					}}
				>
					<Plus />
					Transaction
				</Link>
			</Button>
		</div>
	);
};

export default PocketDetailActions;

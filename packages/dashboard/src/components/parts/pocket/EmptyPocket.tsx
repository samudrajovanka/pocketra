import { Link } from '@tanstack/react-router';
import { Plus, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

const EmptyPocket = () => {
	return (
		<Empty>
			<EmptyMedia variant="icon">
				<Wallet />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle>No pockets found</EmptyTitle>
				<EmptyDescription>
					You haven't created any pockets yet. Create one to start tracking your
					money.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link to="/pockets/new">
					<Button>
						<Plus />
						Create New Pocket
					</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
};

export default EmptyPocket;

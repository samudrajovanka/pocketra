import { Link } from '@tanstack/react-router';
import { ArrowRightLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

const EmptyTransaction = () => {
	return (
		<Empty>
			<EmptyMedia variant="icon">
				<ArrowRightLeft />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle>No transactions found</EmptyTitle>
				<EmptyDescription>
					You haven't made any transactions yet. Create one to start tracking
					your expenses.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link to="/transactions/new">
					<Button>
						<Plus />
						Create New Transaction
					</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
};

export default EmptyTransaction;

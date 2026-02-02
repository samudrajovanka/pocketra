import { Link } from '@tanstack/react-router';
import { ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

const NotFoundTransaction = () => {
	return (
		<Empty>
			<EmptyMedia variant="icon">
				<ArrowRightLeft />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle>No transaction found</EmptyTitle>
				<EmptyDescription>
					Transaction not found. Please check the transaction ID or try again
					later.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link to="/transactions">
					<Button>Back to Transactions</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
};

export default NotFoundTransaction;

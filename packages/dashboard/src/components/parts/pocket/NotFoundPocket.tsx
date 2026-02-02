import { Link } from '@tanstack/react-router';
import { Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@/components/ui/empty';

const NotFoundPocket = () => {
	return (
		<Empty>
			<EmptyMedia variant="icon">
				<Wallet />
			</EmptyMedia>
			<EmptyHeader>
				<EmptyTitle>No pocket found</EmptyTitle>
				<EmptyDescription>
					Pocket not found. Please check the pocket ID or try again later.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Link to="/pockets">
					<Button>Back to Pockets</Button>
				</Link>
			</EmptyContent>
		</Empty>
	);
};

export default NotFoundPocket;

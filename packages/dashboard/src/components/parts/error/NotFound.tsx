import { Link } from '@tanstack/react-router';
import { Ghost } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NotFound() {
	return (
		<div className="flex h-dvh w-full flex-col items-center justify-center">
			<div className="flex flex-col items-center space-y-6 text-center">
				<div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
					<Ghost className="h-12 w-12 text-blue-600" />
				</div>

				<div className="space-y-2">
					<h1 className="text-4xl font-bold sm:text-5xl text-primary">404</h1>
					<p className="typography-subheading font-medium">Off the books</p>
					<p className="max-w-150 typography-large">
						Oops! It looks like this page isn't in your budget. Let's get you
						back to tracking your finances.
					</p>
				</div>

				<Button asChild className="mt-8">
					<Link to="/dashboard">Back to Dashboard</Link>
				</Button>
			</div>
		</div>
	);
}

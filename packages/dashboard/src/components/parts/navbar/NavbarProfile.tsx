import LogoutButton from '@/components/parts/button/LogoutButton';
import ToggleNominalButton from '@/components/parts/button/ToggleNominalButton';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMeQuery } from '@/query/auth';

const NavbarProfile = () => {
	const getMeQuery = useGetMeQuery();

	return (
		<QueryHandling
			queryResult={getMeQuery}
			renderLoading={<Skeleton className="h-8 w-8 rounded-full" />}
			render={(response) => {
				const user = response.data.data;

				return (
					<Popover>
						<PopoverTrigger asChild>
							<Button variant="ghost" className="relative h-8 w-8 rounded-full">
								<Avatar>
									{user.avatarUrl && (
										<AvatarImage src={user.avatarUrl} alt={user.name} />
									)}
									<AvatarFallback>
										{user.name?.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
							</Button>
						</PopoverTrigger>

						<PopoverContent className="w-56 p-0" align="end" forceMount>
							<div className="space-y-1 bg-primary/5 p-4">
								<p className="typography-small">{user.name}</p>
								<p className="text-muted-foreground typography-xsmall">
									{user.email}
								</p>
							</div>

							<div className="px-4 pb-4 pt-2 grid gap-3">
								<div className="flex items-center justify-between">
									<p className="typography-small">Hide Nominal</p>
									<ToggleNominalButton />
								</div>

								<LogoutButton />
							</div>
						</PopoverContent>
					</Popover>
				);
			}}
		/>
	);
};

export default NavbarProfile;

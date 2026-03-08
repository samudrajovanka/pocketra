import { useNavigate } from '@tanstack/react-router';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { clearAuthCookie } from '@/lib/helpers/cookie';
import { useGetMeQuery, useLogoutMutation } from '@/query/auth';
import useGlobalStore from '@/store/globalStore';

const DashboardNavbar = () => {
	const navigate = useNavigate();
	const getMeQuery = useGetMeQuery();
	const logoutMutation = useLogoutMutation();
	const { startLoadingScreen, stopLoadingScreen } = useGlobalStore();

	const handleLogout = async () => {
		startLoadingScreen({ loadingText: 'Logging out...' });
		try {
			await logoutMutation.mutateAsync();
			await clearAuthCookie();
			navigate({ to: '/auth/login' });
		} finally {
			stopLoadingScreen();
		}
	};

	return (
		<div className="bg-primary border border-sidebar-border rounded-lg flex items-center justify-between p-2">
			<SidebarTrigger className="text-primary-foreground hover:text-primary" />

			<QueryHandling
				queryResult={getMeQuery}
				renderLoading={<Skeleton className="h-8 w-8 rounded-full" />}
				render={(response) => {
					const user = response.data.data;

					return (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-8 w-8 rounded-full"
								>
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

							<PopoverContent className="w-56" align="end" forceMount>
								<div className="grid gap-4">
									<div className="flex flex-col space-y-1">
										<p className="typography-small">{user.name}</p>
										<p className="text-muted-foreground typography-xsmall">
											{user.email}
										</p>
									</div>
									<Button
										variant="outlineDestructive"
										onClick={handleLogout}
										size="sm"
										disabled={logoutMutation.isPending}
									>
										{logoutMutation.isPending ? 'Logging out...' : 'Logout'}
									</Button>
								</div>
							</PopoverContent>
						</Popover>
					);
				}}
			/>
		</div>
	);
};

export default DashboardNavbar;

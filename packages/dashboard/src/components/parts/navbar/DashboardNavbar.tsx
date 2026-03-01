import { useNavigate } from '@tanstack/react-router';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
		<div className="bg-sidebar border border-sidebar-border rounded-lg flex items-center justify-between p-2 sticky top-2 z-50">
			<SidebarTrigger />

			<QueryHandling
				queryResult={getMeQuery}
				renderLoading={<Skeleton className="h-9 w-9 rounded-full" />}
				render={(response) => {
					const user = response.data.data;

					return (
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant="ghost"
									className="relative h-9 w-9 rounded-full"
								>
									<Avatar className="h-9 w-9">
										<AvatarFallback className="bg-primary/20">
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

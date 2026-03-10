import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { clearAuthCookie } from '@/lib/helpers/cookie';
import { useLogoutMutation } from '@/query/auth';
import useGlobalStore from '@/store/globalStore';

const LogoutButton = () => {
	const navigate = useNavigate();
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
		<Button
			variant="outlineDestructive"
			onClick={handleLogout}
			size="sm"
			disabled={logoutMutation.isPending}
		>
			{logoutMutation.isPending ? 'Logging out...' : 'Logout'}
		</Button>
	);
};

export default LogoutButton;

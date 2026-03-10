import { SidebarTrigger } from '@/components/ui/sidebar';
import NavbarProfile from './NavbarProfile';

const DashboardNavbar = () => {
	return (
		<div className="bg-primary border border-sidebar-border rounded-lg flex items-center justify-between p-2">
			<SidebarTrigger className="text-primary-foreground hover:text-primary" />

			<NavbarProfile />
		</div>
	);
};

export default DashboardNavbar;

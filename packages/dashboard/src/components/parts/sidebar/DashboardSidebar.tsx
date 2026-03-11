import { Link, useRouterState } from '@tanstack/react-router';
import { Logo } from '@/components/ui/logo';
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';
import { menuItems } from './data/menu';

const DashboardSidebar = () => {
	const routerState = useRouterState();
	const currentPath = routerState.location.pathname;
	const { setOpenMobile } = useSidebar();

	return (
		<Sidebar variant="floating">
			<SidebarHeader>
				<div className="flex items-center px-4">
					<Logo withText />
				</div>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{menuItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										isActive={currentPath === item.url}
										onClick={() => setOpenMobile(false)}
									>
										<Link to={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
};

export default DashboardSidebar;

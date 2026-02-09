import type React from 'react';
import DashboardNavbar from '@/components/parts/navbar/DashboardNavbar';
import DashboardSidebar from '@/components/parts/sidebar/DashboardSidebar';
import Container from '@/components/ui/container';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
	return (
		<SidebarProvider>
			<DashboardSidebar />

			<SidebarInset className="pt-2 px-4 pb-4">
				<DashboardNavbar />

				<Container className="flex flex-1 flex-col gap-4 py-4">
					{children}
				</Container>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;

import type React from 'react';
import DashboardNavbar from '@/components/parts/navbar/DashboardNavbar';
import DashboardSidebar from '@/components/parts/sidebar/DashboardSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
	return (
		<SidebarProvider>
			<DashboardSidebar />

			<SidebarInset className="pt-2 px-4 pb-4">
				<DashboardNavbar />

				<div className="flex flex-1 flex-col gap-4 py-4">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;

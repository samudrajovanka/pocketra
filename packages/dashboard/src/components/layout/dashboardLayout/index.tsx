import type React from 'react';
import DashboardNavbar from '@/components/parts/navbar/DashboardNavbar';
import DashboardSidebar from '@/components/parts/sidebar/DashboardSidebar';
import {
	SidebarContentInset,
	SidebarInset,
	SidebarProvider,
} from '@/components/ui/sidebar';

const DashboardLayout = ({ children }: React.PropsWithChildren) => {
	return (
		<SidebarProvider>
			<DashboardSidebar />

			<SidebarInset className="pb-4">
				<SidebarContentInset className="px-2 sticky top-0 pt-2 z-50 bg-background">
					<DashboardNavbar />
				</SidebarContentInset>

				{children}
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;

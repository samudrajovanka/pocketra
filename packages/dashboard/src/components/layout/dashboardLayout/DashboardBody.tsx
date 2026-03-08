import type React from 'react';
import Container from '@/components/ui/container';
import { SidebarContentInset } from '@/components/ui/sidebar';

const DashboardBody = ({
	children,
	containerClassName,
}: React.PropsWithChildren<{ containerClassName?: string }>) => {
	return (
		<SidebarContentInset className="mt-4">
			<Container className={containerClassName}>{children}</Container>
		</SidebarContentInset>
	);
};

export default DashboardBody;

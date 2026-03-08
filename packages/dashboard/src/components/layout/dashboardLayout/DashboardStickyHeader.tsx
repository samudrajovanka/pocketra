import Container from '@/components/ui/container';
import { SidebarContentInset } from '@/components/ui/sidebar';

const DashboardStickyHeader = ({ children }: React.PropsWithChildren) => {
	return (
		<div className="sticky top-14 py-4 z-40 bg-background">
			<SidebarContentInset>
				<Container>{children}</Container>
			</SidebarContentInset>
		</div>
	);
};

export default DashboardStickyHeader;

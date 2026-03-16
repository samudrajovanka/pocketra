import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import FinancialOverview from '@/components/parts/dashboard/FinancialOverview';
import RecentTransactions from '@/components/parts/dashboard/RecentTransactions';
import ReportSummary from '@/components/parts/dashboard/ReportSummary';

export default function DashboardPage() {
	return (
		<DashboardBody containerClassName="space-y-8 @container/dashboard">
			<FinancialOverview />
			<ReportSummary />
			<RecentTransactions />
		</DashboardBody>
	);
}

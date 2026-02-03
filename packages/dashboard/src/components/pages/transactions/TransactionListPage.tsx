import { Link } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import HeaderDashboardInset from '@/components/layout/dashboardLayout/HeaderDashboardInset';
import TransactionFilters from '@/components/parts/transaction/TransactionFilters';
import TransactionList from '@/components/parts/transaction/TransactionList';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';

const TransactionListPage = () => {
	return (
		<div className="space-y-6">
			<HeaderDashboardInset>
				<PageTitle title="Transactions" noBack>
					<Button asChild>
						<Link to="/transactions/new">
							<Plus /> Add Transaction
						</Link>
					</Button>
				</PageTitle>

				<TransactionFilters />
			</HeaderDashboardInset>

			<TransactionList />
		</div>
	);
};

export default TransactionListPage;

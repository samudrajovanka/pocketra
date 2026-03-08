import { Link } from '@tanstack/react-router';
import { ArrowUp, Plus } from 'lucide-react';
import DashboardBody from '@/components/layout/dashboardLayout/DashboardBody';
import DashboardStickyHeader from '@/components/layout/dashboardLayout/DashboardStickyHeader';
import TransactionFilters from '@/components/parts/transaction/TransactionFilters';
import TransactionList from '@/components/parts/transaction/TransactionList';
import { Button } from '@/components/ui/button';
import PageTitle from '@/components/ui/page-title';

const TransactionListPage = () => {
	return (
		<div>
			<DashboardStickyHeader>
				<PageTitle title="Transactions" noBack>
					<div className="flex gap-2">
						<Button variant="outline" asChild className="flex-1">
							<Link to="/transactions/new" search={{ method: 'transfer' }}>
								<ArrowUp /> Transfer
							</Link>
						</Button>
						<Button asChild className="flex-1">
							<Link to="/transactions/new">
								<Plus /> Transaction
							</Link>
						</Button>
					</div>
				</PageTitle>

				<TransactionFilters />
			</DashboardStickyHeader>

			<DashboardBody>
				<TransactionList />
			</DashboardBody>
		</div>
	);
};

export default TransactionListPage;

import { Link } from '@tanstack/react-router';
import { ArrowUp, Plus } from 'lucide-react';
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
					<div className="flex gap-2">
						<Button variant="outline" asChild>
							<Link to="/transactions/new" search={{ method: 'transfer' }}>
								<ArrowUp /> Transfer
							</Link>
						</Button>
						<Button asChild>
							<Link to="/transactions/new">
								<Plus /> Transaction
							</Link>
						</Button>
					</div>
				</PageTitle>

				<TransactionFilters />
			</HeaderDashboardInset>

			<TransactionList />
		</div>
	);
};

export default TransactionListPage;

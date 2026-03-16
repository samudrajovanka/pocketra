import MetrixCard from '@/components/parts/card/MetrixCard';
import MetrixCardLoading from '@/components/parts/card/MetrixCardLoading';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { REPORT_PERIOD } from '@/lib/constants/report';
import { getGrowthTooltipMessage } from '@/lib/helpers/report';
import { useGetReportSummaryQuery } from '@/query/report';
import { ExpenseByCategoryChart } from '../charts/ExpenseByCategoryChart';
import { ExpenseByPocketChart } from '../charts/ExpenseByPocketChart';

const period = REPORT_PERIOD.month_to_date;

export default function ReportSummary() {
	const summaryQuery = useGetReportSummaryQuery({
		period,
	});

	return (
		<div className="space-y-4 bg-slate-100 p-4 rounded-xl">
			<div className="grid grid-cols-1 @xl/dashboard:grid-cols-2 @3xl/dashboard:grid-cols-3 gap-4">
				<QueryHandling
					queryResult={summaryQuery}
					renderLoading={[...Array(3)].map((_, idx) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: use index
						<MetrixCardLoading key={idx} />
					))}
					render={({ data }) => (
						<>
							<MetrixCard
								variant="transaction"
								title="Income"
								amount={Number(data.data.income.value)}
								growth={data.data.income.growthPercent}
								tooltipGrowthMessage={getGrowthTooltipMessage(period)}
								type="income"
							/>
							<MetrixCard
								variant="transaction"
								title="Expense"
								amount={Number(data.data.expense.value)}
								growth={data.data.expense.growthPercent}
								tooltipGrowthMessage={getGrowthTooltipMessage(period)}
								type="expense"
							/>
							<MetrixCard
								variant="transaction"
								title="Net"
								amount={Number(data.data.net.value)}
								growth={data.data.net.growthPercent}
								tooltipGrowthMessage={getGrowthTooltipMessage(period)}
								type={Number(data.data.net.value) > 0 ? 'income' : 'expense'}
								className="@xl/dashboard:col-span-2 @3xl/dashboard:col-span-1"
							/>
						</>
					)}
				/>
			</div>

			<div className="gap-4 grid grid-cols-1 @xl/dashboard:grid-cols-2">
				<ExpenseByPocketChart period={period} />
				<ExpenseByCategoryChart period={period} />
			</div>
		</div>
	);
}

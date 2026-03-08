import { Pie, PieChart } from 'recharts';
import QueryHandling from '@/components/parts/query/QueryHandling';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	halfPieProps,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoTooltip } from '@/components/ui/tooltip';
import type { ExpenseByPocketResponse } from '@/endpoints/report/types';
import { useGetExpenseByPocketQuery } from '@/query/report';
import type { ReportPeriod } from '@/types/report';

type ExpenseByPocketChartProps = {
	period: ReportPeriod;
};

const TOP = 3;

export function ExpenseByPocketChart({ period }: ExpenseByPocketChartProps) {
	const result = useGetExpenseByPocketQuery({ period, top: TOP });

	return (
		<Card>
			<CardHeader>
				<div className="flex gap-2 items-center">
					<CardTitle className="typography-subheading-2">
						Expense by Pocket
					</CardTitle>
					<InfoTooltip content={`Top ${TOP} expense pockets`} />
				</div>
			</CardHeader>
			<CardContent>
				<QueryHandling
					queryResult={result}
					renderLoading={<Skeleton className="h-40 w-full rounded-xl" />}
					renderEmpty={
						<div className="flex items-center justify-center h-62.5 text-muted-foreground">
							No data available for this period
						</div>
					}
					checkEmpty={({ data }) => !data.data.length}
					render={({ data }) => {
						const chartData =
							data.data.map(
								(item: ExpenseByPocketResponse[number], index: number) => ({
									...item,
									amount: Number(item.amount),
									fill: `var(--chart-${(index % 5) + 1})`,
								}),
							) || [];

						const chartConfig = {
							amount: {
								label: 'Amount',
							},
							...chartData.reduce((acc: ChartConfig, item) => {
								acc[item.name] = {
									label: item.name,
									color: item.fill,
								};
								return acc;
							}, {} as ChartConfig),
						} satisfies ChartConfig;

						return (
							<ChartContainer config={chartConfig} className="mx-auto max-h-40">
								<PieChart>
									<ChartTooltip content={<ChartTooltipContent hideLabel />} />
									<Pie
										data={chartData}
										dataKey="amount"
										nameKey="name"
										{...halfPieProps}
									/>
									<ChartLegend
										content={<ChartLegendContent nameKey="name" />}
									/>
								</PieChart>
							</ChartContainer>
						);
					}}
				/>
			</CardContent>
		</Card>
	);
}

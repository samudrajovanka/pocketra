import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import DateRangePicker from '@/components/ui/date-range-picker';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { NumberInput } from '@/components/ui/number-input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type { GetTransactionsParams } from '@/endpoints/transaction/types';
import { DATE_RANGE_PERIOD } from '@/lib/constants/time';
import { TRANSACTION_TYPE } from '@/lib/constants/transactions';
import { getDateRange } from '@/lib/helpers/time';
import { useGetPocketOptionsQuery } from '@/query/pocket';
import useTransactionFiltersStore, {
	type DatePreset as TransactionDatePreset,
	type Filter as TransactionFilter,
} from '@/store/transactionFiltersStore';
import type { DateRangePeriod } from '@/types/time';
import type { TransactionType } from '@/types/transaction';
import QueryHandling from '../query/QueryHandling';

export type TransactionFilterModalProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	hideFilter?: {
		pocket?: boolean;
	};
};

const DEFAULT_CUSTOM_DATE_RANGE = getDateRange(DATE_RANGE_PERIOD.last_7_days);

const TransactionFilterModal = ({
	open,
	onOpenChange,
	hideFilter,
}: TransactionFilterModalProps) => {
	const { filters, setFilters } = useTransactionFiltersStore();
	const [localFilters, setLocalFilters] = useState<TransactionFilter>({
		pocketId: '',
		datePreset: 'all',
	});
	const getPocketOptionsQuery = useGetPocketOptionsQuery();

	useEffect(() => {
		if (open) {
			const _filters = {
				pocketId: filters.pocketId,
				type: filters.type ?? ('all' as TransactionType),
				minAmount: filters.minAmount,
				maxAmount: filters.maxAmount,
				datePreset: filters.datePreset,
				startDate: filters.startDate,
				endDate: filters.endDate,
			};

			if (
				(_filters.pocketId === undefined || _filters.pocketId === '') &&
				getPocketOptionsQuery.isSuccess
			) {
				_filters.pocketId = 'all';
			}

			setLocalFilters(_filters);
		}
	}, [open, filters, getPocketOptionsQuery.isSuccess]);

	const handleFilterChange = (
		key: keyof GetTransactionsParams,
		value: string | number | undefined,
	) => {
		const newFilters = { ...localFilters };

		if (value === 'all' || value === undefined || value === '') {
			delete newFilters[key];
		} else {
			Object.assign(newFilters, { [key]: value });
		}

		setLocalFilters(newFilters);
	};

	const handleDatePresetChange = (value: string) => {
		const preset = value as TransactionDatePreset;

		if (preset === 'all') {
			setLocalFilters({
				...localFilters,
				datePreset: 'all',
				startDate: undefined,
				endDate: undefined,
			});

			return;
		}

		const dateRange =
			preset === 'custom'
				? DEFAULT_CUSTOM_DATE_RANGE
				: getDateRange(preset as DateRangePeriod);

		setLocalFilters({
			...localFilters,
			datePreset: preset,
			startDate: format(dateRange.from, 'yyyy-MM-dd'),
			endDate: format(dateRange.to, 'yyyy-MM-dd'),
		});
	};

	const applyFilters = () => {
		const newFilters = {
			...filters,
			...localFilters,
			cursor: undefined,
		};

		if (!localFilters.pocketId || localFilters.pocketId === 'all')
			delete newFilters.pocketId;
		if (!localFilters.type || (localFilters.type as string) === 'all')
			delete newFilters.type;
		if (!localFilters.minAmount) delete newFilters.minAmount;
		if (!localFilters.maxAmount) delete newFilters.maxAmount;
		if (!localFilters.datePreset || localFilters.datePreset === 'all') {
			delete newFilters.startDate;
			delete newFilters.endDate;
		}

		setFilters(newFilters);
		onOpenChange(false);
	};

	const resetFilters = () => {
		setLocalFilters({
			pocketId: 'all',
			type: 'all' as TransactionType,
			datePreset: 'all',
			startDate: undefined,
			endDate: undefined,
		});
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-100">
				<DialogHeader>
					<DialogTitle>Filter Transactions</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{!hideFilter?.pocket && (
						<Field>
							<FieldLabel>Pocket</FieldLabel>
							<Select
								value={localFilters.pocketId}
								onValueChange={(value) => handleFilterChange('pocketId', value)}
								disabled={getPocketOptionsQuery.isPending}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											getPocketOptionsQuery.isPending
												? 'Getting pockets...'
												: 'Select pocket'
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<QueryHandling
										queryResult={getPocketOptionsQuery}
										render={({ data }) => (
											<>
												<SelectItem value="all">All Pockets</SelectItem>

												{data.data.map((pocket) => (
													<SelectItem key={pocket.id} value={pocket.id}>
														{pocket.name}
													</SelectItem>
												))}
											</>
										)}
									/>
								</SelectContent>
							</Select>
						</Field>
					)}

					<Field>
						<FieldLabel>Type</FieldLabel>
						<Select
							value={localFilters.type}
							onValueChange={(value) => handleFilterChange('type', value)}
						>
							<SelectTrigger>
								<SelectValue placeholder="All Types" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Types</SelectItem>
								<SelectItem value={TRANSACTION_TYPE.income}>Income</SelectItem>
								<SelectItem value={TRANSACTION_TYPE.expense}>
									Expense
								</SelectItem>
							</SelectContent>
						</Select>
					</Field>

					<Field>
						<FieldLabel>Date Range</FieldLabel>
						<Select
							value={localFilters.datePreset}
							onValueChange={handleDatePresetChange}
						>
							<SelectTrigger>
								<SelectValue placeholder="All Time" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Time</SelectItem>
								<SelectItem value={DATE_RANGE_PERIOD.last_7_days}>
									Last 7 Days
								</SelectItem>
								<SelectItem value={DATE_RANGE_PERIOD.full_month}>
									This Month
								</SelectItem>
								<SelectItem value={DATE_RANGE_PERIOD.custom}>
									Custom Date Range
								</SelectItem>
							</SelectContent>
						</Select>
					</Field>

					{localFilters.datePreset === DATE_RANGE_PERIOD.custom && (
						<Field>
							<FieldLabel>Custom Range</FieldLabel>
							<DateRangePicker
								value={{
									from: localFilters.startDate
										? new Date(localFilters.startDate)
										: undefined,
									to: localFilters.endDate
										? new Date(localFilters.endDate)
										: undefined,
								}}
								onChange={(range) => {
									setLocalFilters({
										...localFilters,
										startDate: range?.from
											? format(range.from, 'yyyy-MM-dd')
											: undefined,
										endDate: range?.to
											? format(range.to, 'yyyy-MM-dd')
											: undefined,
									});
								}}
							/>
						</Field>
					)}

					<div className="grid grid-cols-2 gap-4">
						<Field>
							<FieldLabel>Min Amount</FieldLabel>
							<NumberInput
								placeholder="Min"
								value={localFilters.minAmount}
								onChange={(value) => handleFilterChange('minAmount', value)}
							/>
						</Field>
						<Field>
							<FieldLabel>Max Amount</FieldLabel>
							<NumberInput
								placeholder="Max"
								value={localFilters.maxAmount}
								onChange={(value) => handleFilterChange('maxAmount', value)}
							/>
						</Field>
					</div>
				</div>

				<DialogFooter className="flex-col sm:flex-row gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={resetFilters}
						className="w-full sm:w-auto"
					>
						Reset
					</Button>
					<Button
						type="button"
						onClick={applyFilters}
						className="w-full sm:w-auto"
					>
						Apply Filters
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default TransactionFilterModal;

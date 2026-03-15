import { Filter } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
	hideFilter?: {
		pocket?: boolean;
	};
};

const DEFAULT_CUSTOM_DATE_RANGE = getDateRange(DATE_RANGE_PERIOD.last_7_days);

const TransactionFilterModal = ({
	hideFilter,
}: TransactionFilterModalProps) => {
	const { filters, setFilters } = useTransactionFiltersStore();
	const [open, setOpen] = useState(false);
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

		let customDateRange: Partial<DateRange> | undefined;
		if (preset === 'custom') customDateRange = DEFAULT_CUSTOM_DATE_RANGE;
		else if (preset === 'full_month')
			customDateRange = {
				from: new Date(),
			};

		const dateRange = getDateRange(preset as DateRangePeriod, customDateRange);

		setLocalFilters({
			...localFilters,
			datePreset: preset,
			startDate: dateRange.from,
			endDate: dateRange.to,
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
		setOpen(false);
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

	const activeFilterCount = useMemo(() => {
		return [
			!hideFilter?.pocket && filters.pocketId,
			filters.type,
			filters.minAmount,
			filters.maxAmount,
			filters.startDate || filters.endDate,
		].filter(Boolean).length;
	}, [filters, hideFilter]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" className="gap-2">
					<Filter />
					Filters
					{activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
				</Button>
			</DialogTrigger>
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
									from: localFilters.startDate,
									to: localFilters.endDate,
								}}
								onChange={(range) => {
									setLocalFilters({
										...localFilters,
										startDate: range?.from,
										endDate: range?.to,
									});
								}}
								placeholder="Select date range"
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

import { Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { useGetPocketOptionsQuery } from '@/query/pocket';
import useTransactionFiltersStore from '@/store/transactionFiltersStore';
import type { TransactionType } from '@/types/transaction';
import QueryHandling from '../query/QueryHandling';

export type TransactionFilterModalProps = {
	hideFilter?: {
		pocket?: boolean;
	};
};

const TransactionFilterModal = ({
	hideFilter,
}: TransactionFilterModalProps) => {
	const { filters, setFilters } = useTransactionFiltersStore();
	const [open, setOpen] = useState(false);
	const [localFilters, setLocalFilters] = useState<GetTransactionsParams>({
		pocketId: '',
	});
	const getPocketOptionsQuery = useGetPocketOptionsQuery();

	useEffect(() => {
		if (open) {
			const _filters = {
				pocketId: filters.pocketId,
				type: filters.type ?? ('all' as TransactionType),
				minAmount: filters.minAmount,
				maxAmount: filters.maxAmount,
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

		setFilters(newFilters);
		setOpen(false);
	};

	const resetFilters = () => {
		setLocalFilters({
			pocketId: 'all',
			type: 'all' as TransactionType,
		});
	};

	const activeFilterCount = [
		!hideFilter?.pocket && filters.pocketId,
		filters.type,
		filters.minAmount,
		filters.maxAmount,
	].filter(Boolean).length;

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
								<SelectItem value="income">Income</SelectItem>
								<SelectItem value="expense">Expense</SelectItem>
							</SelectContent>
						</Select>
					</Field>

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

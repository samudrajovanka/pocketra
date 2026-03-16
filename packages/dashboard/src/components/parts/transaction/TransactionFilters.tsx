import { Filter, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import useTransactionFiltersStore from '@/store/transactionFiltersStore';
import TransactionFilterModal, {
	type TransactionFilterModalProps,
} from './TransactionFilterModal';

type TransactionFiltersProps = Pick<TransactionFilterModalProps, 'hideFilter'>;

const TransactionFilters = ({ hideFilter }: TransactionFiltersProps) => {
	const { filters, setFilters, resetFilters } = useTransactionFiltersStore();
	const [isOpenFilterDialog, setIsOpenFilterDialog] = useState(false);
	const [search, setSearch] = useState(filters.description || '');
	const debouncedSearch = useDebounce(search);

	useEffect(() => {
		const newFilters = { ...filters };
		if (debouncedSearch === '') {
			delete newFilters.description;
		} else {
			newFilters.description = debouncedSearch;
		}

		if ((filters.description || '') !== debouncedSearch) {
			setFilters(newFilters);
		}
	}, [debouncedSearch, filters, setFilters]);

	const resetAllFilters = () => {
		resetFilters();
		setSearch('');
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

	const hasAnyFilter = useMemo(
		() => activeFilterCount > 0,
		[activeFilterCount],
	);

	return (
		<>
			<Card data-card-size="small">
				<CardContent className="flex items-center gap-4">
					<Field className="flex-1">
						<Input
							placeholder="Search..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</Field>

					<Button
						variant="outline"
						className="gap-2"
						onClick={() => setIsOpenFilterDialog(true)}
					>
						<Filter />
						Filters
						{activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
					</Button>

					{hasAnyFilter && (
						<Button
							variant="ghost"
							size="icon"
							onClick={resetAllFilters}
							title="Reset all filters"
						>
							<X className="size-4" />
						</Button>
					)}
				</CardContent>
			</Card>

			<TransactionFilterModal
				open={isOpenFilterDialog}
				onOpenChange={setIsOpenFilterDialog}
				hideFilter={hideFilter}
			/>
		</>
	);
};

export default TransactionFilters;

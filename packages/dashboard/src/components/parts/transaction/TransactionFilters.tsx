import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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

	const hasAnyFilter = useMemo(
		() =>
			(!hideFilter?.pocket && filters.pocketId) ||
			filters.type ||
			filters.description ||
			filters.minAmount ||
			filters.maxAmount ||
			filters.startDate ||
			filters.endDate,
		[filters, hideFilter],
	);

	return (
		<Card data-card-size="small">
			<CardContent className="flex items-center gap-4">
				<Field className="flex-1">
					<Input
						placeholder="Search..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</Field>

				<TransactionFilterModal hideFilter={hideFilter} />

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
	);
};

export default TransactionFilters;

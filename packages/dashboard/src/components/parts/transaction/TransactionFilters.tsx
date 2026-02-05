import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/use-debounce';
import useTransactionFiltersStore from '@/store/transactionFiltersStore';
import TransactionFilterModal, {
	type TransactionFilterModalProps,
} from './TransactionFilterModal';

type TransactionFiltersProps = Pick<TransactionFilterModalProps, 'hideFilter'>;

const TransactionFilters = ({ hideFilter }: TransactionFiltersProps) => {
	const { filters, setFilters } = useTransactionFiltersStore();
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
		setFilters({});
		setSearch('');
	};

	const hasAnyFilter =
		(!hideFilter?.pocket && filters.pocketId) ||
		filters.type ||
		filters.description ||
		filters.minAmount ||
		filters.maxAmount;

	return (
		<div className="bg-card border rounded-lg p-4 space-y-4">
			<div className="flex items-center gap-4">
				<Field className="flex-1">
					<Input
						placeholder="Search transaction..."
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
			</div>
		</div>
	);
};

export default TransactionFilters;

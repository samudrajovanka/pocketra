import { create } from 'zustand';
import type { GetTransactionsParams } from '@/endpoints/transaction/types';
import type { DateRangePeriod } from '@/types/time';

export type DatePreset =
	| Extract<DateRangePeriod, 'last_7_days' | 'full_month' | 'custom'>
	| 'all';

export type Filter = GetTransactionsParams & {
	datePreset?: DatePreset;
};

type TransactionFiltersStore = {
	filters: Filter;
	setFilters: (filters: Filter) => void;
	resetFilters: () => void;
};

const defaultFilter: Filter = {
	datePreset: 'all',
};

const useTransactionFiltersStore = create<TransactionFiltersStore>((set) => ({
	filters: defaultFilter,
	setFilters: (filters) => set((state) => ({ ...state, filters })),
	resetFilters: () => set({ filters: defaultFilter }),
}));

export default useTransactionFiltersStore;

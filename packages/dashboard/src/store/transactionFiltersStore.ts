import { create } from 'zustand';
import type { GetTransactionsParams } from '@/endpoints/transaction/types';

type TransactionFiltersStore = {
	filters: GetTransactionsParams;
	setFilters: (filters: GetTransactionsParams) => void;

	resetFilters: () => void;
};

const useTransactionFiltersStore = create<TransactionFiltersStore>((set) => ({
	filters: {},
	setFilters: (filters) => set({ filters }),
	resetFilters: () => set({ filters: {} }),
}));

export default useTransactionFiltersStore;

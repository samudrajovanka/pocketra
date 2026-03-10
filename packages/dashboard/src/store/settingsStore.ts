import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SettingsStore = {
	isNominalHidden: boolean;
	toggleNominalHidden: () => void;
};

export const useSettingsStore = create<SettingsStore>()(
	persist(
		(set) => ({
			isNominalHidden: false,
			toggleNominalHidden: () =>
				set((state) => ({ isNominalHidden: !state.isNominalHidden })),
		}),
		{
			name: 'pocketra-settings',
		},
	),
);

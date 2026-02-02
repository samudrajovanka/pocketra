import { create } from 'zustand';

type LoadingScreen = {
	isLoading: boolean;
	loadingText: string;
};

type GlobalStore = {
	loadingScreen: LoadingScreen;
	startLoadingScreen: (
		options?: Partial<Omit<LoadingScreen, 'isLoading'>>,
	) => void;
	stopLoadingScreen: () => void;
};

const defautLoadingScreen: LoadingScreen = {
	isLoading: false,
	loadingText: 'Loading...',
};

const useGlobalStore = create<GlobalStore>((set) => ({
	loadingScreen: defautLoadingScreen,
	startLoadingScreen: (options) =>
		set((state) => ({
			loadingScreen: {
				...state.loadingScreen,
				loadingText: options?.loadingText ?? state.loadingScreen.loadingText,
				isLoading: true,
			},
		})),
	stopLoadingScreen: () => set({ loadingScreen: defautLoadingScreen }),
}));

export default useGlobalStore;

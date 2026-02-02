import { Logo } from '@/components/ui/logo';
import useGlobalStore from '@/store/globalStore';

const GlobalLoading = () => {
	const { loadingScreen } = useGlobalStore();

	if (!loadingScreen.isLoading) {
		return null;
	}

	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
			<div className="flex flex-col items-center gap-4">
				<div className="animate-bounce">
					<Logo size="xl" />
				</div>
				<p className="text-lg font-medium text-foreground animate-pulse">
					{loadingScreen.loadingText}
				</p>
			</div>
		</div>
	);
};

export default GlobalLoading;

import type { VariantProps } from 'class-variance-authority';
import { Eye, EyeOff } from 'lucide-react';
import { Button, type buttonVariants } from '@/components/ui/button';
import { useSettingsStore } from '@/store/settingsStore';

type ToggleNominalButtonProps = {
	variant?: VariantProps<typeof buttonVariants>['variant'];
};

const ToggleNominalButton = ({
	variant = 'ghost',
}: ToggleNominalButtonProps) => {
	const { isNominalHidden, toggleNominalHidden } = useSettingsStore();

	return (
		<Button variant={variant} size="icon" onClick={toggleNominalHidden}>
			{isNominalHidden ? <EyeOff /> : <Eye />}
		</Button>
	);
};

export default ToggleNominalButton;

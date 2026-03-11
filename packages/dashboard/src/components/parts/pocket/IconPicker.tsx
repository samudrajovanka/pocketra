import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { POCKET_EMOJIS } from '@/lib/constants/pockets';
import { cn } from '@/lib/utils';

type IconPickerProps = {
	value: string;
	onChange: (value: string) => void;
	className?: string;
};

const IconPicker = ({ value, onChange, className }: IconPickerProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className={cn('typography-large', className)}
				>
					{value || '❓'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-2" align="start">
				<div className="grid grid-cols-8 gap-1">
					{POCKET_EMOJIS.map((emoji) => (
						<Button
							key={emoji}
							variant="ghost"
							className="typography-large"
							size="icon"
							onClick={() => {
								onChange(emoji);
								setOpen(false);
							}}
						>
							{emoji}
						</Button>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default IconPicker;

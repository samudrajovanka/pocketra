import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EMOJI_LIST } from './data/emoji';

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
					className={cn('h-10 w-10 text-2xl p-0', className)}
				>
					{value || '❓'}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-2" align="start">
				<div className="grid grid-cols-8 gap-1">
					{EMOJI_LIST.map((emoji) => (
						<Button
							key={emoji}
							variant="ghost"
							className="h-8 w-8 text-lg p-0"
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

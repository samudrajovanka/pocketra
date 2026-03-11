import { Ban } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { POKCET_COLORS } from '@/lib/constants/pockets';
import { cn } from '@/lib/utils';

type ColorPickerProps = {
	value?: string | null;
	onChange: (value?: string | null) => void;
	className?: string;
};

const ColorPicker = ({ value, onChange, className }: ColorPickerProps) => {
	const [open, setOpen] = useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					size="icon"
					className={cn('typography-large', className)}
				>
					{value ? (
						<div
							className="size-5 rounded-full"
							style={{ backgroundColor: value }}
						/>
					) : (
						<Ban className="size-5 text-muted-foreground" />
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-2" align="start">
				<div className="grid grid-cols-4 gap-2">
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							'rounded-full',
							!value && 'ring-2 ring-primary ring-offset-2',
						)}
						onClick={() => {
							onChange(null);
							setOpen(false);
						}}
						title="No Color"
					>
						<Ban className="size-5 text-muted-foreground" />
					</Button>
					{POKCET_COLORS.map((color) => (
						<Button
							key={color.value}
							variant="ghost"
							size="icon"
							className={cn(
								'p-0 rounded-full',
								value === color.value && 'ring-2 ring-primary ring-offset-2',
							)}
							style={{ backgroundColor: color.value }}
							onClick={() => {
								onChange(color.value);
								setOpen(false);
							}}
							title={color.label}
						/>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default ColorPicker;

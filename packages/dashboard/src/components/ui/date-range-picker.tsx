import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

type DateRangePickerProps = {
	value?: DateRange;
	onChange?: (range: DateRange | undefined) => void;
	className?: string;
	placeholder?: string;
};

const DateRangePicker = ({
	value,
	onChange,
	className,
	placeholder = 'Pick a date range',
}: DateRangePickerProps) => {
	const [open, setOpen] = useState(false);

	const displayText = () => {
		if (value?.from) {
			if (value.to) {
				return `${format(value.from, 'MMM d, yyyy')} - ${format(value.to, 'MMM d, yyyy')}`;
			}
			return format(value.from, 'MMM d, yyyy');
		}
		return placeholder;
	};

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						'w-full justify-start text-left font-normal',
						!value?.from && 'text-muted-foreground',
						className,
					)}
				>
					<CalendarIcon className="mr-2 size-4" />
					{displayText()}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="range"
					selected={value}
					onSelect={onChange}
					numberOfMonths={2}
					defaultMonth={value?.from}
				/>
			</PopoverContent>
		</Popover>
	);
};

export { DateRangePicker };
export type { DateRangePickerProps };

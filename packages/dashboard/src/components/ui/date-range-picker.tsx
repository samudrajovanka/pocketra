import type { DateRange } from 'react-day-picker';
import DatePicker from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

type DateRangePickerProps = {
	value?: DateRange;
	onChange?: (range: DateRange | undefined) => void;
	className?: string;
};

const DateRangePicker = ({
	value,
	onChange,
	className,
}: DateRangePickerProps) => {
	const handleFromChange = (from: Date | undefined) => {
		onChange?.({
			from,
			to: value?.to,
		});
	};

	const handleToChange = (to: Date | undefined) => {
		onChange?.({
			from: value?.from,
			to,
		});
	};

	return (
		<div className="@container/date-range-picker">
			<div
				className={cn(
					'grid gap-2 @2xs/date-range-picker:grid-cols-2 @xs/date-range-picker:grid-cols-2',
					className,
				)}
			>
				<DatePicker
					value={value?.from}
					onChange={handleFromChange}
					placeholder="Start date"
					disabled={value?.to ? { after: value.to } : undefined}
				/>
				<DatePicker
					value={value?.to}
					onChange={handleToChange}
					placeholder="End date"
					disabled={value?.from ? { before: value.from } : undefined}
				/>
			</div>
		</div>
	);
};

export default DateRangePicker;

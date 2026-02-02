import * as React from 'react';
import { Input } from '@/components/ui/input';
import app from '@/config/app';
import { formatNumber } from '@/lib/formatter/number';

type NumberInputProps = Omit<
	React.ComponentProps<typeof Input>,
	'value' | 'onChange'
> & {
	value?: number;
	onChange?: (value: number) => void;
};

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
	({ value, onChange, ...props }, forwardedRef) => {
		const [displayValue, setDisplayValue] = React.useState('');
		const inputRef = React.useRef<HTMLInputElement>(null);
		const cursorRef = React.useRef<number | null>(null);

		React.useImperativeHandle(
			forwardedRef,
			() => inputRef.current as HTMLInputElement,
		);

		const internalFormatNumber = React.useCallback(
			(num: number | undefined) => {
				return formatNumber(num);
			},
			[],
		);

		// Logic to restore cursor position
		React.useLayoutEffect(() => {
			if (cursorRef.current !== null && inputRef.current) {
				const input = inputRef.current;
				const val = input.value;
				let newCursorPos = 0;
				let digitsSeen = 0;

				// Find position where we have seen 'cursorRef.current' digits
				for (let i = 0; i < val.length; i++) {
					if (digitsSeen === cursorRef.current) break;
					if (/\d/.test(val[i])) digitsSeen++;
					newCursorPos++;
				}

				input.setSelectionRange(newCursorPos, newCursorPos);
				cursorRef.current = null;
			}
		}, []);

		React.useEffect(() => {
			setDisplayValue(internalFormatNumber(value));
		}, [value, internalFormatNumber]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			const inputValue = e.target.value;
			const selectionStart = e.target.selectionStart ?? 0;

			let digitsBeforeCursor = 0;
			for (let i = 0; i < selectionStart; i++) {
				if (/\d/.test(inputValue[i])) digitsBeforeCursor++;
			}
			cursorRef.current = digitsBeforeCursor;

			if (inputValue === '') {
				setDisplayValue('');
				onChange?.(0);
				return;
			}

			const numericString = inputValue.replace(/\D/g, '');
			const numberValue = Number(numericString);

			if (
				numberValue > app.maxSafeInteger ||
				numberValue < app.maxSafeInteger * -1
			) {
				setDisplayValue((prev) => prev);
				return;
			}

			setDisplayValue(internalFormatNumber(numberValue));
			onChange?.(numberValue);
		};

		return (
			<Input
				{...props}
				ref={inputRef}
				value={displayValue}
				onChange={handleChange}
				inputMode="numeric"
				type="text"
			/>
		);
	},
);
NumberInput.displayName = 'NumberInput';

export { NumberInput };

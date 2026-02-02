import type { AnyFieldApi } from '@tanstack/react-form';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isInvalidField = (field: AnyFieldApi) => {
	return field.state.meta.isTouched && field.state.meta.errors.length > 0;
};

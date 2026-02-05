import type { AnyFieldApi } from '@tanstack/react-form';
import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
	extend: {
		classGroups: {
			'font-size': [(classPart: string) => /^typography-/.test(classPart)],
		},
	},
});

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isInvalidField = (field: AnyFieldApi) => {
	return field.state.meta.isTouched && field.state.meta.errors.length > 0;
};

export type LogoSize = 'md' | 'lg' | 'xl';

export type LogoProps = {
	className?: string;
	imgClassName?: string;
	/**
	 * @default md
	 */
	size?: LogoSize;
	withText?: boolean;
};

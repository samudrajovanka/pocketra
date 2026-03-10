import app from '@/config/app';
import { cn } from '@/lib/utils';
import type { LogoProps, LogoSize } from './logo.types';

const logoSize: Record<LogoSize, number> = {
	md: 24,
	lg: 32,
	xl: 48,
};

const textClassName: Record<LogoSize, string> = {
	md: 'text-lg ml-1',
	lg: 'text-2xl ml-1',
	xl: 'text-[32px] ml-2',
};

const Logo = ({
	size = 'md',
	withText,
	className,
	imgClassName,
	...props
}: LogoProps) => {
	const logoSizeValue = logoSize[size];

	return (
		<div className={cn('flex', className)}>
			<img
				src="/icons/logo.webp"
				alt="logo"
				height={logoSizeValue}
				width={logoSizeValue}
				className={imgClassName}
				{...props}
			/>
			{withText && (
				<span className={cn(textClassName[size], 'font-semibold text-mint')}>
					{app.name}
				</span>
			)}
		</div>
	);
};

export { Logo };

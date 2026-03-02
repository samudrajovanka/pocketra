import { cn } from '@/lib/utils';

import type { ContainerProps } from './container.types';

const Container = ({
	children,
	as: Component = 'div',
	className,
}: ContainerProps) => {
	return (
		<Component
			className={cn(
				'container xl:max-w-5xl mx-auto w-[calc(100%-32px)]',
				className,
			)}
		>
			{children}
		</Component>
	);
};

export default Container;

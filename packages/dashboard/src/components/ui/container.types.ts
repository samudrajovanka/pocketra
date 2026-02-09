type ContainerComponent =
	| 'div'
	| 'section'
	| 'article'
	| 'main'
	| 'header'
	| 'footer';

export type ContainerProps = React.PropsWithChildren<{
	/**
	 * @default 'div'
	 */
	as?: ContainerComponent;
	className?: string;
}>;

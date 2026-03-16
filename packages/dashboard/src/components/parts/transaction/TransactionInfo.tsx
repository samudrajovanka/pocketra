type TransactionInfoProps = {
	title: string;
	children: React.ReactNode | string;
};

const TransactionInfo = ({ title, children }: TransactionInfoProps) => {
	return (
		<div className="flex flex-col gap-0.5 py-1">
			<span className="typography-small text-muted-foreground">{title}</span>

			{typeof children === 'string' ? (
				<span className="capitalize typography-regular">{children}</span>
			) : (
				children
			)}
		</div>
	);
};

export default TransactionInfo;

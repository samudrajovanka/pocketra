import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/button';

type PageTitleProps = {
	title: string;
	backTo?: string;
	onBack?: () => void;
	children?: React.ReactNode;
	noBack?: boolean;
};

const PageTitle = ({
	title,
	backTo,
	onBack,
	children,
	noBack,
}: PageTitleProps) => {
	const navigate = useNavigate();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else if (backTo) {
			navigate({ to: backTo, replace: true });
		} else {
			window.history.back();
		}
	};

	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between not-last:mb-6 gap-4">
			<div className="flex items-center gap-4">
				{!noBack && (
					<Button variant="ghost" size="icon-sm" onClick={handleBack}>
						<ArrowLeft />
					</Button>
				)}
				<h1 className="typography-heading">{title}</h1>
			</div>

			{children && <div>{children}</div>}
		</div>
	);
};

export default PageTitle;

import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft } from 'lucide-react';
import type React from 'react';
import { Button } from '@/components/ui/button';

type PageTitleProps = {
	title: string;
	backTo?: string;
	children?: React.ReactNode;
	noBack?: boolean;
};

const PageTitle = ({ title, backTo, children, noBack }: PageTitleProps) => {
	const navigate = useNavigate();

	const handleBack = () => {
		if (backTo) {
			navigate({ to: backTo });
		} else {
			window.history.back();
		}
	};

	return (
		<div className="flex items-center justify-between mb-6">
			<div className="flex items-center gap-4">
				{!noBack && (
					<Button variant="ghost" size="icon-sm" onClick={handleBack}>
						<ArrowLeft />
					</Button>
				)}
				<h1 className="text-heading">{title}</h1>
			</div>
			{children && <div>{children}</div>}
		</div>
	);
};

export default PageTitle;

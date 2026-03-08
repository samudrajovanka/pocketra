import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TRANSACTION_TYPE } from '@/lib/constants/transactions';
import type { TransactionType } from '@/types/transaction';

type TransferBadgeProps = {
	type: TransactionType;
	relatedPocketName: string;
};

const TransferBadge = ({ type, relatedPocketName }: TransferBadgeProps) => {
	const isTransferOut = type === TRANSACTION_TYPE.transfer_out;

	return (
		<Badge
			variant={isTransferOut ? 'destructive-secondary' : 'success-secondary'}
		>
			{isTransferOut ? <ArrowRight /> : <ArrowLeft />}
			{relatedPocketName}
		</Badge>
	);
};

export default TransferBadge;

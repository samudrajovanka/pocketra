import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CannotEditTransactionAlert = () => {
	return (
		<Alert variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Cannot Edit</AlertTitle>
			<AlertDescription>
				This transaction is older than 1 week after created and cannot be
				edited.
			</AlertDescription>
		</Alert>
	);
};

export default CannotEditTransactionAlert;

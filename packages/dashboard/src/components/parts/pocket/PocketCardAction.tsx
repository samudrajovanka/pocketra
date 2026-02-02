import { Link } from '@tanstack/react-router';
import { Edit, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import type { Pocket } from '@/types/pocket';
import DeletePocketDialog from './DeletePocketDialog';

type PocketCardActionProps = {
	pocket: Pocket;
};

const PocketCardAction = ({ pocket }: PocketCardActionProps) => {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isPopoverOpen, setIsPopoverOpen] = useState(false);

	return (
		<>
			<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
				<PopoverTrigger asChild>
					<Button variant="ghost" size="icon" className="h-8 w-8">
						<MoreVertical />
						<span className="sr-only">Open menu</span>
					</Button>
				</PopoverTrigger>
				<PopoverContent align="end" className="w-40 p-2">
					<div className="flex flex-col gap-1">
						<Link
							to="/pockets/$id/edit"
							params={{ id: pocket.id }}
							className="w-full"
							onClick={() => setIsPopoverOpen(false)}
						>
							<Button
								variant="ghost"
								size="sm"
								className="w-full justify-start"
							>
								<Edit />
								Customize
							</Button>
						</Link>
						<Button
							variant="ghostDestructive"
							size="sm"
							className="w-full justify-start"
							onClick={() => {
								setIsPopoverOpen(false);
								setShowDeleteDialog(true);
							}}
						>
							<Trash2 />
							Delete
						</Button>
					</div>
				</PopoverContent>
			</Popover>

			<DeletePocketDialog
				pocket={pocket}
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			/>
		</>
	);
};

export default PocketCardAction;

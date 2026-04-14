import { useForm } from '@tanstack/react-form';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupNumberInput,
	InputGroupText,
} from '@/components/ui/input-group';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import type {
	CreateBudgetPayload,
	UpdateBudgetPayload,
} from '@/endpoints/budget/types';
import {
	createBudgetValidator,
	updateBudgetValidator,
} from '@/endpoints/budget/validator';
import { BUDGET_PERIOD, BUDGET_PERIOD_OPTIONS } from '@/lib/constants/pockets';
import { DATE_NOW_ZERO } from '@/lib/constants/time';
import { isInvalidField } from '@/lib/utils';
import {
	useCreatePocketBudgetMutation,
	useUpdatePocketBudgetMutation,
} from '@/query/budget';
import type { BudgetPeriod } from '@/types/budget';

type BudgetFormType = 'create' | 'update';

type FormValues<T extends BudgetFormType> = T extends 'create'
	? CreateBudgetPayload
	: UpdateBudgetPayload;

type BudgetFormProps<T extends BudgetFormType> = {
	pocketId: string;
	open: boolean;
	onClose: () => void;
	initialValues?: FormValues<T>;
	type: T;
};

export function BudgetForm<T extends BudgetFormType>({
	pocketId,
	open,
	onClose,
	initialValues,
	type,
}: BudgetFormProps<T>) {
	const createBudgetMutation = useCreatePocketBudgetMutation();
	const updateBudgetMutation = useUpdatePocketBudgetMutation();

	const isCreate = type === 'create';
	const isSubmitting =
		createBudgetMutation.isPending || updateBudgetMutation.isPending;

	const getDefaultValues = () => {
		if (isCreate) {
			return {
				limitAmount: 100000,
				period: BUDGET_PERIOD.monthly,
				alertThreshold: 80,
				periodStartDate: DATE_NOW_ZERO.toISOString(),
			};
		}

		return {
			limitAmount: initialValues?.limitAmount,
			period: initialValues?.period || BUDGET_PERIOD.monthly,
			alertThreshold: initialValues?.alertThreshold
				? Math.round(initialValues.alertThreshold * 100)
				: 80,
		};
	};

	const form = useForm({
		defaultValues: getDefaultValues(),
		validators: {
			onChange: isCreate
				? // biome-ignore lint/suspicious/noExplicitAny: use any for validator
					(createBudgetValidator as any)
				: // biome-ignore lint/suspicious/noExplicitAny: use any for validator
					(updateBudgetValidator as any),
			onSubmit: isCreate
				? // biome-ignore lint/suspicious/noExplicitAny: use any for validator
					(createBudgetValidator as any)
				: // biome-ignore lint/suspicious/noExplicitAny: use any for validator
					(updateBudgetValidator as any),
		},
		onSubmit: async ({ value }) => {
			await handleSubmit(value as FormValues<T>);
		},
	});

	const handleSubmit = async (values: FormValues<T>) => {
		if (isCreate) {
			const data = values as CreateBudgetPayload;
			const payload = {
				...data,
				periodStartDate: new Date(format(data.periodStartDate, 'yyyy-MM-dd')),
				alertThreshold: data.alertThreshold / 100,
			};
			await createBudgetMutation.mutateAsync({
				pocketId,
				payload,
			});
		} else {
			const data = values as UpdateBudgetPayload;
			const payload = {
				...data,
				alertThreshold: (data.alertThreshold ?? 80) / 100,
			};
			await updateBudgetMutation.mutateAsync({
				pocketId,
				payload,
			});
		}
		onClose();
	};

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-106.25">
				<DialogHeader>
					<DialogTitle>
						{isCreate ? 'Create Budget' : 'Update Budget'}
					</DialogTitle>
				</DialogHeader>

				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<form.Field name="limitAmount">
						{(field) => {
							const isInvalid = isInvalidField(field);
							return (
								<Field data-invalid={isInvalid} data-required>
									<FieldLabel>Limit Amount</FieldLabel>
									<InputGroup>
										<InputGroupNumberInput
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(val) => field.handleChange(val)}
											placeholder="0"
										/>

										<InputGroupAddon>
											<InputGroupText>IDR</InputGroupText>
										</InputGroupAddon>
									</InputGroup>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="period">
						{(field) => {
							const isInvalid = isInvalidField(field);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel>Budget Period</FieldLabel>
									<Select
										value={field.state.value}
										onValueChange={(value) =>
											field.handleChange(value as BudgetPeriod)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select period" />
										</SelectTrigger>
										<SelectContent>
											{BUDGET_PERIOD_OPTIONS.map((option) => (
												<SelectItem key={option.value} value={option.value}>
													{option.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					<form.Field name="alertThreshold">
						{(field) => {
							const isInvalid = isInvalidField(field);
							return (
								<Field data-invalid={isInvalid}>
									<FieldLabel>Alert Threshold</FieldLabel>
									<InputGroup>
										<InputGroupNumberInput
											id={field.name}
											name={field.name}
											value={field.state.value}
											onChange={(value) => field.handleChange(value)}
											min={1}
											max={100}
											step={1}
											placeholder="80"
										/>
									</InputGroup>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>

					{isCreate && (
						<form.Field name="periodStartDate">
							{(field) => {
								const isInvalid = isInvalidField(field);
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel>Start Date</FieldLabel>
										<DatePicker
											value={field.state.value}
											onChange={(date) =>
												field.handleChange(
													date?.toISOString() || new Date().toISOString(),
												)
											}
											placeholder="Select start date"
										/>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Field>
					)}

					<DialogFooter>
						<Button type="button" variant="outline" onClick={onClose}>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting
								? `${isCreate ? 'Creating' : 'Updating'}...`
								: `${isCreate ? 'Create' : 'Update'} Budget`}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

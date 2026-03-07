import { useForm, useStore } from '@tanstack/react-form';
import { format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
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
	TransferTransactionPayload,
	UpdateTransferTransactionPayload,
} from '@/endpoints/transaction/types';
import {
	transferTransactionValidator,
	updateTransferTransactionValidator,
} from '@/endpoints/transaction/validator';
import { isInvalidField } from '@/lib/utils';
import { useGetPocketOptionsQuery } from '@/query/pocket';
import QueryHandling from '../query/QueryHandling';

type TransferPocketFormProps<T extends 'create' | 'update'> = {
	onSubmit: (
		values: T extends 'create'
			? TransferTransactionPayload
			: UpdateTransferTransactionPayload,
	) => Promise<void>;
	isSubmitting?: boolean;
	fromPocketId?: string;
	initialValues?: z.infer<typeof updateTransferTransactionValidator>;
	type?: T;
	disabled?: boolean;
	submitText?: string;
	submitTextLoading?: string;
};

const TransferPocketForm = <T extends 'create' | 'update'>({
	onSubmit,
	isSubmitting,
	fromPocketId,
	initialValues,
	type = 'create' as T,
	disabled,
	submitText = 'Transfer',
	submitTextLoading = 'Transferring...',
}: TransferPocketFormProps<T>) => {
	const getPocketOptionsQuery = useGetPocketOptionsQuery();
	const [isFromPocketValid, setIsFromPocketValid] = useState(false);

	const form = useForm({
		defaultValues: initialValues
			? {
					fromPocketId: initialValues.fromPocketId || '',
					toPocketId: initialValues.toPocketId || '',
					amount: initialValues.amount || 0,
					description: initialValues.description || '',
					date: initialValues.date || new Date().toISOString(),
				}
			: {
					fromPocketId: '',
					toPocketId: '',
					amount: 0,
					description: 'Transfer pocket',
					date: new Date().toISOString(),
				},
		validators: {
			onChange:
				type === 'create'
					? // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(transferTransactionValidator as any)
					: // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(updateTransferTransactionValidator as any),
			onSubmit:
				type === 'create'
					? // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(transferTransactionValidator as any)
					: // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(updateTransferTransactionValidator as any),
		},
		onSubmit: async ({ value }) => {
			if (disabled) return;

			const payload = {
				...value,
				date: new Date(value.date).toISOString(),
			};

			if (type === 'create') {
				await onSubmit(payload as TransferTransactionPayload);
			} else {
				await (
					onSubmit as (
						values: UpdateTransferTransactionPayload,
					) => Promise<void>
				)(payload as UpdateTransferTransactionPayload);
			}
		},
	});

	const storeFromPocketId = useStore(
		form.store,
		(state) => state.values.fromPocketId,
	);

	const setInitialPocket = useCallback(() => {
		if (!storeFromPocketId && fromPocketId && getPocketOptionsQuery.isSuccess) {
			const pocket = getPocketOptionsQuery.data?.data.data.find(
				(pocket) => pocket.id === fromPocketId,
			);

			if (pocket) {
				setIsFromPocketValid(true);
				form.setFieldValue('fromPocketId', pocket.id);
			}
		}
	}, [
		storeFromPocketId,
		fromPocketId,
		getPocketOptionsQuery.isSuccess,
		form,
		getPocketOptionsQuery.data?.data.data.find,
	]);

	useEffect(() => {
		setInitialPocket();
	}, [setInitialPocket]);

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<form.Field name="description">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Description</FieldLabel>
							<InputGroup>
								<InputGroupInput
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(e) => field.handleChange(e.target.value)}
									maxLength={255}
									placeholder="Example: Transfer for savings"
									disabled={disabled}
								/>
								<InputGroupAddon align="block-end">
									<InputGroupText className="ml-auto">
										{field.state.value.length}/255
									</InputGroupText>
								</InputGroupAddon>
							</InputGroup>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<form.Field name="fromPocketId">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Source Pocket</FieldLabel>
							<Select
								value={field.state.value}
								onValueChange={(val) => field.handleChange(val)}
								disabled={
									getPocketOptionsQuery.isPending ||
									isFromPocketValid ||
									disabled
								}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											getPocketOptionsQuery.isPending
												? 'Getting pockets...'
												: 'Select source pocket'
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<QueryHandling
										queryResult={getPocketOptionsQuery}
										render={({ data }) =>
											data.data
												.filter(
													(pocket) =>
														pocket.id !== form.state.values.toPocketId,
												)
												.map((pocket) => (
													<SelectItem key={pocket.id} value={pocket.id}>
														{pocket.name}
													</SelectItem>
												))
										}
									/>
								</SelectContent>
							</Select>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<form.Field name="toPocketId">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Destination Pocket</FieldLabel>
							<Select
								value={field.state.value}
								onValueChange={(val) => field.handleChange(val)}
								disabled={getPocketOptionsQuery.isPending || disabled}
							>
								<SelectTrigger>
									<SelectValue
										placeholder={
											getPocketOptionsQuery.isPending
												? 'Getting pockets...'
												: 'Select destination pocket'
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<QueryHandling
										queryResult={getPocketOptionsQuery}
										render={({ data }) =>
											data.data
												.filter(
													(pocket) =>
														pocket.id !== form.state.values.fromPocketId,
												)
												.map((pocket) => (
													<SelectItem key={pocket.id} value={pocket.id}>
														{pocket.name}
													</SelectItem>
												))
										}
									/>
								</SelectContent>
							</Select>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<form.Field name="amount">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Amount</FieldLabel>
							<InputGroup>
								<InputGroupNumberInput
									name={field.name}
									value={field.state.value}
									onBlur={field.handleBlur}
									onChange={(val) => field.handleChange(val)}
									placeholder="0"
									disabled={disabled}
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

			<form.Field name="date">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Date</FieldLabel>
							<Input
								type="date"
								value={format(field.state.value, 'yyyy-MM-dd')}
								disabled={disabled}
								onChange={(e) => {
									const val = e.target.value;
									if (val) {
										field.handleChange(new Date(val).toISOString());
									} else {
										field.handleChange('');
									}
								}}
							/>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<div className="flex justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={() => window.history.back()}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting || disabled}>
					{isSubmitting ? submitTextLoading : submitText}
				</Button>
			</div>
		</form>
	);
};

export default TransferPocketForm;

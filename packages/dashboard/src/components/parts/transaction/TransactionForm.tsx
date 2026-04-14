import { useForm, useStore } from '@tanstack/react-form';
import { useCallback, useEffect, useState } from 'react';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
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
	CreateTransactionPayload,
	UpdateTransactionPayload,
} from '@/endpoints/transaction/types';
import {
	createTransactionValidator,
	updateTransactionValidator,
} from '@/endpoints/transaction/validator';
import { DATE_NOW_ZERO } from '@/lib/constants/time';
import { isInvalidField } from '@/lib/utils';
import { useGetCategoriesQuery } from '@/query/category';
import { useGetPocketOptionsQuery } from '@/query/pocket';
import type { TransactionType } from '@/types/transaction';
import QueryHandling from '../query/QueryHandling';

type TransactionFormProps<T extends 'create' | 'update'> = {
	initialValues?: z.infer<typeof createTransactionValidator>;
	onSubmit: (
		values: T extends 'create'
			? CreateTransactionPayload
			: UpdateTransactionPayload,
	) => Promise<void>;
	isSubmitting?: boolean;
	submitText?: string;
	submitTextLoading?: string;
	type?: T;
	disabled?: boolean;
	fromPocketId?: string;
};

const TransactionForm = <T extends 'create' | 'update'>({
	initialValues,
	onSubmit,
	isSubmitting,
	submitText = 'Save',
	submitTextLoading = 'Saving...',
	type = 'create' as T,
	disabled,
	fromPocketId,
}: TransactionFormProps<T>) => {
	const getCategoriesQuery = useGetCategoriesQuery();
	const [isFromPocketValid, setIsFromPocketValid] = useState(false);
	const categoriesData = getCategoriesQuery.data?.data.data;

	const getPocketOptionsQuery = useGetPocketOptionsQuery();

	const form = useForm({
		defaultValues: initialValues
			? initialValues
			: {
					amount: 0,
					type: 'expense' as TransactionType,
					categoryId: '',
					pocketId: '',
					description: '',
					date: DATE_NOW_ZERO.toISOString(),
				},
		validators: {
			onChange:
				type === 'create'
					? // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(createTransactionValidator as any)
					: // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(updateTransactionValidator as any),
			onSubmit:
				type === 'create'
					? // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(createTransactionValidator as any)
					: // biome-ignore lint/suspicious/noExplicitAny: use any for validator
						(updateTransactionValidator as any),
		},
		onSubmit: async ({ value }) => {
			if (disabled) return;

			const payload = {
				...value,
				date: new Date(value.date).toISOString(),
			};
			const { type: _type, ...finalPayload } = payload;

			if (type === 'create') {
				await onSubmit(payload as CreateTransactionPayload);
			} else {
				await (onSubmit as (values: UpdateTransactionPayload) => Promise<void>)(
					finalPayload as UpdateTransactionPayload,
				);
			}
		},
	});

	const transactionType = useStore(form.store, (state) => state.values.type);
	const pocketId = useStore(form.store, (state) => state.values.pocketId);
	const categoryId = useStore(form.store, (state) => state.values.categoryId);

	const setInitialPocket = useCallback(() => {
		if (!pocketId && fromPocketId && getPocketOptionsQuery.isSuccess) {
			const pocket = getPocketOptionsQuery.data?.data.data.find(
				(pocket) => pocket.id === fromPocketId,
			);

			if (pocket) {
				setIsFromPocketValid(true);
				form.setFieldValue('pocketId', pocket.id);
			}
		}
	}, [
		pocketId,
		fromPocketId,
		getPocketOptionsQuery.isSuccess,
		form,
		getPocketOptionsQuery.data?.data.data.find,
	]);

	useEffect(() => {
		setInitialPocket();
	}, [setInitialPocket]);

	const getOtherCategory = useCallback(
		(type: TransactionType) => {
			if (!categoriesData) return null;

			const categories =
				type === 'income' ? categoriesData.income : categoriesData.expense;

			const category = categories.find((c) => c.name === 'Other');

			if (!category) return null;

			return category;
		},
		[categoriesData],
	);

	useEffect(() => {
		const otherCategory = getOtherCategory(transactionType as TransactionType);

		if (otherCategory && categoryId === '') {
			form.setFieldValue('categoryId', otherCategory.id);
		}
	}, [transactionType, categoryId, form.setFieldValue, getOtherCategory]);

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
									placeholder="Example: Buy a coffee"
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

			<div className="flex gap-4">
				<form.Field name="type">
					{(field) => {
						return (
							<Field data-required className="md:w-2/12">
								<FieldLabel>Type</FieldLabel>
								<Select
									value={field.state.value}
									onValueChange={(val: 'income' | 'expense') => {
										field.handleChange(val);
										const otherCategory = getOtherCategory(val);
										form.setFieldValue('categoryId', otherCategory?.id ?? '');
									}}
									disabled={type === 'update' || disabled}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="income">Income</SelectItem>
										<SelectItem value="expense">Expense</SelectItem>
									</SelectContent>
								</Select>
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
			</div>

			<form.Field name="pocketId">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Pocket</FieldLabel>
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
												: 'Select pocket'
										}
									/>
								</SelectTrigger>
								<SelectContent>
									<QueryHandling
										queryResult={getPocketOptionsQuery}
										render={({ data }) =>
											data.data.map((pocket) => (
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

			<form.Field name="categoryId">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<form.Subscribe selector={(state) => state.values.type}>
							{(type) => {
								return (
									<Field data-invalid={isInvalid} data-required>
										<FieldLabel>Category</FieldLabel>
										<Select
											value={field.state.value}
											onValueChange={(val) => field.handleChange(val)}
											disabled={getCategoriesQuery.isPending || disabled}
										>
											<SelectTrigger>
												<SelectValue
													placeholder={
														getCategoriesQuery.isPending
															? 'Getting categories...'
															: 'Select category'
													}
												/>
											</SelectTrigger>
											<SelectContent>
												<QueryHandling
													queryResult={getCategoriesQuery}
													render={({ data }) => {
														const categories =
															type === 'income'
																? data.data.income
																: data.data.expense;

														return categories?.map((cat) => (
															<SelectItem key={cat.id} value={cat.id}>
																{cat.name}
															</SelectItem>
														));
													}}
												/>
											</SelectContent>
										</Select>
										{isInvalid && (
											<FieldError errors={field.state.meta.errors} />
										)}
									</Field>
								);
							}}
						</form.Subscribe>
					);
				}}
			</form.Field>

			<form.Field name="date">
				{(field) => {
					const isInvalid = isInvalidField(field);
					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Date</FieldLabel>
							<DatePicker
								value={
									field.state.value ? new Date(field.state.value) : undefined
								}
								disabled={disabled}
								onChange={(date) => {
									if (date) {
										field.handleChange(date.toISOString());
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

export default TransactionForm;

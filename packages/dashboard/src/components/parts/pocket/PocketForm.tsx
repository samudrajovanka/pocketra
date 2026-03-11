import { useForm } from '@tanstack/react-form';
import { useNavigate } from '@tanstack/react-router';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
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
	CreatePocketPayload,
	UpdatePocketPayload,
} from '@/endpoints/pocket/types';
import {
	createPocketValidator,
	updatePocketValidator,
} from '@/endpoints/pocket/validator';
import {
	POCKET_EMOJIS,
	POCKET_TYPE,
	POCKET_TYPE_OPTIONS,
} from '@/lib/constants/pockets';
import { isInvalidField } from '@/lib/utils';
import ColorPicker from './ColorPicker';
import IconPicker from './IconPicker';

type PocketFormProps<T extends 'create' | 'update'> = {
	initialValues?: z.infer<typeof updatePocketValidator>;
	onSubmit: (
		values: T extends 'create' ? CreatePocketPayload : UpdatePocketPayload,
	) => Promise<void>;
	isSubmitting?: boolean;
	submitText?: string;
	submitTextLoading?: string;
	type?: T;
};

const PocketForm = <T extends 'create' | 'update'>({
	initialValues,
	onSubmit,
	isSubmitting,
	submitText = 'Save',
	submitTextLoading = 'Saving...',
	type,
}: PocketFormProps<T>) => {
	const navigate = useNavigate();

	const form = useForm({
		defaultValues: initialValues ?? {
			name: '',
			icon: POCKET_EMOJIS[0],
			type: POCKET_TYPE.cash,
			initialBalance: 0,
		},
		validators: {
			onChange:
				type === 'create' ? createPocketValidator : updatePocketValidator,
			onSubmit:
				type === 'create' ? createPocketValidator : updatePocketValidator,
		},
		onSubmit: async ({ value }) => {
			await onSubmit(
				value as T extends 'create' ? CreatePocketPayload : UpdatePocketPayload,
			);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-4"
		>
			<div className="flex gap-6">
				<form.Field name="icon">
					{(field) => {
						const isInvalid = isInvalidField(field);
						return (
							<Field data-invalid={isInvalid} data-required className="w-fit">
								<FieldLabel>Icon</FieldLabel>
								<div>
									<IconPicker
										value={field.state.value as string}
										onChange={(val) => field.handleChange(val)}
									/>
								</div>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>

				<form.Field name="color">
					{(field) => {
						const isInvalid = isInvalidField(field);
						return (
							<Field data-invalid={isInvalid} data-required className="w-fit">
								<FieldLabel>Color</FieldLabel>
								<div>
									<ColorPicker
										value={field.state.value as string | null | undefined}
										onChange={(val) => field.handleChange(val)}
									/>
								</div>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
			</div>

			<form.Field name="name">
				{(field) => {
					const isInvalid = isInvalidField(field);

					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Name</FieldLabel>
							<Input
								name={field.name}
								value={field.state.value}
								placeholder="Enter pocket name"
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			<form.Field name="type">
				{(field) => {
					const isInvalid = isInvalidField(field);

					return (
						<Field data-invalid={isInvalid} data-required>
							<FieldLabel>Type</FieldLabel>
							<Select
								value={field.state.value}
								onValueChange={(val) =>
									field.handleChange(
										val as (typeof POCKET_TYPE)[keyof typeof POCKET_TYPE],
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select pocket type" />
								</SelectTrigger>
								<SelectContent>
									{POCKET_TYPE_OPTIONS.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											{type.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{isInvalid && <FieldError errors={field.state.meta.errors} />}
						</Field>
					);
				}}
			</form.Field>

			{type === 'create' && (
				<form.Field name="initialBalance">
					{(field) => {
						const isInvalid = isInvalidField(field);
						return (
							<Field data-invalid={isInvalid} data-required>
								<FieldLabel>Initial Balance</FieldLabel>
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
			)}

			<div className="flex justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={() => navigate({ to: '/pockets' })}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting ? submitTextLoading : submitText}
				</Button>
			</div>
		</form>
	);
};

export default PocketForm;

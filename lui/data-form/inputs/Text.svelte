<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { PropChangedEvent } from '../types';

	interface Props {
		value: any | string;
		label: string;
		labelHide?: boolean;
		small?: boolean;
		prop: string;
		placeholder?: string;
		defaultValue?: any;
		optional?: boolean;
		autoFocus?: boolean;
		disabled?: boolean;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		label,
		labelHide = false,
		small = false,
		prop,
		placeholder = '',
		defaultValue = '',
		optional = false,
		autoFocus = false,
		disabled = false,
		onPropChanged = () => {},
	}: Props = $props();

	let validator:
		| z.ZodString
		| z.ZodDefault<z.ZodString>
		| z.ZodDefault<z.ZodOptional<z.ZodString>>
		| z.ZodOptional<z.ZodDefault<z.ZodString>>
		| z.ZodOptional<z.ZodString>;

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let val: string = $derived(value);

	function onInputChange(ev: any) {
		const val = ev.target.value;
		onValueChanged(val);
	}

	function onValueChanged(v: string, showError: boolean = true) {
		const valid = validator.safeParse(v);

		validSuccess = valid.success;
		if (valid.success) {
			onPropChanged({ success: true, value: valid.data, prop });
		} else {
			validError = '';
			if (Array.isArray(valid.error.issues) && valid.error.issues[0]) {
				validError = valid.error.issues[0].message;
			}
			onPropChanged({ success: false, prop, error: validError });

			if (!showError) {
				validError = '';
				validSuccess = true;
			}
		}
	}

	function validateInitValue() {
		onValueChanged(value, false);
	}

	onMount(() => {
		validator = z.string({
			required_error: `${label} обязательно`,
			invalid_type_error: `${label} должен быть строкой`,
		});

		if (optional) {
			validator = validator.optional();
		} else {
			validator = validator.min(1, { message: 'Это поле не может быть пустым' });
		}

		if (defaultValue) {
			validator = validator.default(defaultValue);
		}

		validateInitValue();
	});
</script>

<div class="flex flex-col">
	{#if !labelHide}
		<Label for={prop} class={cn('mb-2', !validSuccess && 'text-red-500', small && 'mb-0 text-xs')}
			>{label}</Label
		>
	{/if}
	<Input
		id={prop}
		type="text"
		{placeholder}
		class={cn(
			'max-w',
			!validSuccess && 'border-red-500 !ring-transparent',
			small && 'h-6 px-2 text-xs',
		)}
		oninput={onInputChange}
		value={val}
		autofocus={autoFocus}
		{disabled}
	/>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

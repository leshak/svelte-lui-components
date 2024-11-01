<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { PropChangedEvent } from '../types';

	interface Props {
		value: any | number;
		label: string;
		labelHide?: boolean;
		small?: boolean;
		prop: string;
		placeholder?: string;
		defaultValue?: any;
		optional?: boolean;
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
		onPropChanged = () => {},
	}: Props = $props();

	let validator:
		| z.ZodNumber
		| z.ZodOptional<z.ZodNumber>
		| z.ZodDefault<z.ZodOptional<z.ZodNumber>>
		| z.ZodDefault<z.ZodNumber>;

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let val: string = $derived(value);

	function onInputChange(ev: any) {
		const val = ev.target.value;
		onValueChanged(val);
	}

	function onValueChanged(v: string) {
		if (v === '') {
			validSuccess = false;
			validError = '';
			onPropChanged({ success: validSuccess, prop, error: validError });
			return;
		}

		const valid = validator.safeParse(v);

		validSuccess = valid.success;
		if (valid.success) {
			onPropChanged({ success: validSuccess, value: valid.data, prop });
		} else {
			validError = '';
			if (Array.isArray(valid.error.issues) && valid.error.issues[0]) {
				validError = valid.error.issues[0].message;
			}
			onPropChanged({ success: validSuccess, prop, error: validError });
		}
	}

	function validateInitValue() {
		onValueChanged(value);
	}

	onMount(() => {
		validator = z.coerce.number({
			required_error: `${label} обязательно`,
			invalid_type_error: `${label} должен быть числом`,
		});

		if (optional) {
			validator = validator.optional();
		}

		if (defaultValue !== undefined) {
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
		type="number"
		{placeholder}
		class={cn(
			'max-w',
			!validSuccess && 'border-red-500 !ring-transparent',
			small && 'h-6 px-2 text-xs',
		)}
		oninput={onInputChange}
		value={val}
	/>
	{#if !validSuccess && validError}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

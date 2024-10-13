<script lang="ts">
	import { z } from 'zod';
	import { createEventDispatcher, onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	const dispatch = createEventDispatcher();

	export let value: any | string;

	export let label: string;
	export let labelHide: boolean = false;
	export let small: boolean = false;
	export let prop: string;
	export let placeholder: string = '';
	export let defaultValue: any = '';
	export let optional: boolean = false;
	export let autoFocus: boolean = false;

	let validator:
		| z.ZodString
		| z.ZodDefault<z.ZodString>
		| z.ZodDefault<z.ZodOptional<z.ZodString>>
		| z.ZodOptional<z.ZodDefault<z.ZodString>>
		| z.ZodOptional<z.ZodString>;

	let validSuccess: boolean = true;
	let validError: string | undefined = undefined;

	let val: string;
	$: {
		val = value;
	}

	function onInputChange(ev: any) {
		const val = ev.target.value;
		onValueChanged(val);
	}

	function onValueChanged(v: string, showError: boolean = true) {
		const valid = validator.safeParse(v);

		validSuccess = valid.success;
		if (valid.success) {
			dispatch('modelChanged', { success: true, value: valid.data, prop });
		} else {
			validError = '';
			if (Array.isArray(valid.error.issues) && valid.error.issues[0]) {
				validError = valid.error.issues[0].message;
			}
			dispatch('modelChanged', { success: false, prop, error: validError });

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
		type="password"
		{placeholder}
		class={cn(
			'max-w',
			!validSuccess && 'border-red-500 !ring-transparent',
			small && 'h-6 px-2 text-xs',
		)}
		on:input={onInputChange}
		value={val}
		autofocus={autoFocus}
	/>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import type { PropChangedEvent } from '../types';
	import SvelteOtp from '../otp-input/SvelteOtp.svelte';

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
		codeLength?: number;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		label,
		labelHide = false,
		small = false,
		prop,
		codeLength = 4,
		onPropChanged = () => {},
	}: Props = $props();

	let validator = z.string({
		required_error: `${label} обязательно`,
		invalid_type_error: `${label} должен быть строкой`,
	});

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let valCode: string = $state('');

	$effect(() => {
		onValueChanged(valCode);
	});

	function onValueChanged(v: string, showError: boolean = true) {
		if (v === undefined) return;

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
		validateInitValue();
	});
</script>

<div class="flex flex-col">
	{#if !labelHide}
		<Label for={prop} class={cn('mb-2', !validSuccess && 'text-red-500', small && 'mb-0 text-xs')}
			>{label}</Label
		>
	{/if}
	<SvelteOtp
		numOfInputs={codeLength}
		separator="&bull;"
		numberOnly
		disableDefaultStyle
		bind:value={valCode}
		wrapperClass="flex gap-2  items-center"
		inputClass="border rounded-md h-9 w-10 flex-1 text-center outline-none focus:border-primary text-sm"
		separatorClass="text-gray-300"
	/>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

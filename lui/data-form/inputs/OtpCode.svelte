<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import * as InputOTP from '$lib/components/ui/input-otp/';
	import { Label } from '$lib/components/ui/label';
	import { REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS } from 'bits-ui';

	import { DataFormOtpCodeType, type PropChangedEvent } from '../types';

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
		codeType?: number;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		label,
		labelHide = false,
		small = false,
		prop,
		codeLength = 4,
		codeType = DataFormOtpCodeType.Digits,
		autoFocus = false,
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

	<InputOTP.Root
		bind:value={valCode}
		maxlength={codeLength}
		pattern={codeType === DataFormOtpCodeType.Digits
			? REGEXP_ONLY_DIGITS
			: codeType === DataFormOtpCodeType.OnlyChars
				? REGEXP_ONLY_CHARS
				: REGEXP_ONLY_DIGITS_AND_CHARS}
	>
		{#snippet children({ cells })}
			<InputOTP.Group class="w-full">
				{#each cells as cell}
					<InputOTP.Slot class="w-full" {cell} />
				{/each}
			</InputOTP.Group>
		{/snippet}
	</InputOTP.Root>

	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

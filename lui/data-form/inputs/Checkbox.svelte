<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import type { PropChangedEvent } from '../types';

	interface Props {
		value: any | number;
		intType?: boolean;
		label: string;
		labelHide?: boolean;
		small?: boolean;
		prop: string;
		defaultValue?: any;
		optional?: boolean;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		intType = false,
		label,
		labelHide = false,
		small = false,
		prop,
		defaultValue = false,
		optional = false,
		onPropChanged = () => {},
	}: Props = $props();

	let validator:
		| z.ZodNumber
		| z.ZodOptional<z.ZodNumber>
		| z.ZodDefault<z.ZodOptional<z.ZodNumber>>
		| z.ZodDefault<z.ZodNumber>;

	let validSuccess: boolean = true;
	let validError: string | undefined = undefined;

	let checked: boolean = $derived(intType ? value === 1 : value);

	function onCheckedChange(checked: string | boolean) {
		onValueChanged(intType ? (checked ? 1 : 0) : checked);
	}

	function onValueChanged(v: any) {
		if (optional && v === undefined) {
			return;
		}

		let vv = v !== undefined ? v : defaultValue;
		onPropChanged({ success: validSuccess, value: vv, prop });
	}

	function validateInitValue() {
		onValueChanged(value);
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

	<Checkbox
		id={prop}
		{onCheckedChange}
		{checked}
		class={cn(small ? 'h-3 w-3 *:h-3 *:w-3' : 'mt-2')}
	/>

	{#if !validSuccess && validError}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

<script lang="ts">
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import type { PropChangedEvent } from '../types';

	interface Props {
		value: any | string;
		values?: any[];
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
		values = [],
		label,
		labelHide = false,
		small = false,
		prop,
		placeholder = '',
		defaultValue = '',
		optional = false,
		onPropChanged = () => {},
	}: Props = $props();

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let val: string = $state('');
	const selectedLabel = $derived(values.find((v) => v === val) || placeholder);

	$effect(() => {
		val = value;
	});

	function onSelectedChange(v: any) {
		onValueChanged(v);
	}

	function onValueChanged(v: string) {
		const vv = v || defaultValue;
		validSuccess = true;
		validError = '';

		const idx = values.indexOf(vv);
		if (idx === -1) {
			if (optional) {
				onPropChanged({ success: true, value: undefined, prop });
			} else {
				validSuccess = false;
				validError = 'Неизвестное значение';
				onPropChanged({ success: validSuccess, prop, error: validError });
			}
		} else {
			onPropChanged({ success: validSuccess, value: vv, prop });
		}
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
	<Select.Root type="single" onValueChange={onSelectedChange} value={val}>
		<Select.Trigger
			class={cn(
				'w-[100%] pr-2',
				!validSuccess && 'border-red-500 !ring-transparent',
				small && 'h-6 px-2 text-xs',
			)}
		>
			{selectedLabel}
		</Select.Trigger>
		<Select.Content>
			{#each values as v}
				<Select.Item value={v} class={cn(small && 'h-6 px-2 text-xs')}>{v}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';

	const dispatch = createEventDispatcher();

	export let value: any | string;
	export let values: any[] = [];

	export let label: string;
	export let labelHide: boolean = false;
	export let small: boolean = false;
	export let prop: string;
	export let placeholder: string = '';
	export let defaultValue: any = '';
	export let optional: boolean = false;

	let validSuccess: boolean = true;
	let validError: string | undefined = undefined;

	let val: { value: string; label: string; disabled: boolean };

	$: {
		val = {
			value: value || defaultValue,
			label: value || defaultValue,
			disabled: false,
		};
	}

	function onSelectedChange(v: any) {
		onValueChanged(v.value);
	}

	function onValueChanged(v: string) {
		const vv = v || defaultValue;
		validSuccess = true;
		validError = '';

		const idx = values.indexOf(vv);
		if (idx === -1) {
			if (optional) {
				dispatch('modelChanged', { success: true, value: undefined, prop });
			} else {
				validSuccess = false;
				validError = 'Неизвестное значение';
				dispatch('modelChanged', { success: validSuccess, prop, error: validError });
			}
		} else {
			dispatch('modelChanged', { success: validSuccess, value: vv, prop });
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
	<Select.Root {onSelectedChange} selected={val}>
		<Select.Trigger
			class={cn(
				'w-[100%] pr-2',
				!validSuccess && 'border-red-500 !ring-transparent',
				small && 'h-6 px-2 text-xs',
			)}
		>
			<Select.Value {placeholder} />
		</Select.Trigger>
		<Select.Content>
			{#each values as v}
				<Select.Item value={v} class={cn(small && 'h-6 px-2 text-xs')}>{v}</Select.Item>
			{/each}
		</Select.Content>
		<Select.Input name={prop} />
	</Select.Root>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

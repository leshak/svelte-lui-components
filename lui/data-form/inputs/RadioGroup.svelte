<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Label } from '$lib/components/ui/label';

	const dispatch = createEventDispatcher();

	export let value: any | string;
	export let values: any[] = [];
	export let intType: boolean = false;

	export let label: string;
	export let labelHide: boolean = false;
	export let small: boolean = false;
	export let prop: string;
	export let defaultValue: any = '';
	export let optional: boolean = false;
	export let vertical: boolean = false;

	let validSuccess: boolean = true;
	let validError: string | undefined = undefined;

	let val: any;

	$: {
		val = value;
	}

	function onValueChanged(v: any) {
		val = v;

		const vv = intType ? parseInt(v || defaultValue, 10) : v || defaultValue;
		validSuccess = true;
		validError = '';

		const idx = values.findIndex((x) => x.val === vv);
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
			currentValue = String(vv);
		}
	}

	function validateInitValue() {
		onValueChanged(value);
	}

	onMount(() => {
		validateInitValue();
	});

	let currentValue: string;
	$: {
		onValueChanged(currentValue);
	}
</script>

<div class="flex flex-col">
	{#if !labelHide}
		<Label for={prop} class={cn('mb-2', !validSuccess && 'text-red-500', small && 'mb-0 text-xs')}
			>{label}</Label
		>
	{/if}

	<RadioGroup.Root
		onValueChange={onValueChanged}
		bind:value={currentValue}
		class={cn('flex', vertical ? 'flex-col' : 'mt-2.5', small && 'mt-0')}
	>
		{#each values as v, i}
			<div class={cn('flex items-center space-x-1', vertical && 'space-x-2')}>
				<RadioGroup.Item value={String(v.val)} id={`rg-${prop}-${i}`} />
				<Label for={`rg-${prop}-${i}`} class={cn('cursor-pointer', small && 'text-xs')}
					>{v.label}</Label
				>
			</div>
		{/each}
		<RadioGroup.Input name="spacing" />
	</RadioGroup.Root>

	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

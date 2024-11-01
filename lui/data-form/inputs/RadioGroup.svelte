<script lang="ts">
	import { onMount } from 'svelte';

	import { cn } from '$lib/utils.js';

	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import { Label } from '$lib/components/ui/label';
	import type { PropChangedEvent } from '../types';

	interface Props {
		value: any | string;
		values?: any[];
		intType?: boolean;
		label: string;
		labelHide?: boolean;
		small?: boolean;
		prop: string;
		defaultValue?: any;
		optional?: boolean;
		vertical?: boolean;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		values = [],
		intType = false,
		label,
		labelHide = false,
		small = false,
		prop,
		defaultValue = '',
		optional = false,
		vertical = false,
		onPropChanged = () => {},
	}: Props = $props();

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let val = $state('');

	function onValueChanged(v: any) {
		let vv = v !== undefined ? v : defaultValue;
		vv = intType ? parseInt(vv, 10) : vv;

		validSuccess = true;
		validError = '';

		const idx = values.findIndex((x) => x.val === vv);
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
			val = vv;
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

	<RadioGroup.Root
		onValueChange={onValueChanged}
		value={String(val)}
		class={cn('flex', vertical ? 'flex-col' : 'mt-2.5', small && 'mt-0')}
	>
		{#each values as v, i}
			<div class={cn('flex items-center space-x-1', vertical && 'space-x-2')}>
				<RadioGroup.Item value={String(v.val)} id={`rg-${prop.replaceAll('.', '_')}-${i}`} />
				<Label
					for={`rg-${prop.replaceAll('.', '_')}-${i}`}
					class={cn('cursor-pointer', small && 'text-xs')}>{v.label}</Label
				>
			</div>
		{/each}
	</RadioGroup.Root>

	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

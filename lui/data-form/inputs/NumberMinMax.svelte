<script lang="ts">
	import { z } from 'zod';
	import { onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { TrOutlineTilde } from 'svelte-icons-pack/tr';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { PropChangedEvent } from '../types';

	interface Props {
		value: any | number[];
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
		defaultValue = [0, 0],
		optional = false,
		onPropChanged = () => {},
	}: Props = $props();

	const validator = z.coerce.number();

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let valMin: number = $state(0);
	let valMax: number = $state(0);
	$effect(() => {
		if (value !== undefined && value.length === 2) {
			valMin = value[0];
			valMax = value[1];
		}
	});

	function onInputChangeMin(ev: any) {
		const val = ev.target.value;
		onValueChanged([val, valMax]);
	}

	function onInputChangeMax(ev: any) {
		const val = ev.target.value;
		onValueChanged([valMin, val]);
	}

	function onValueChanged(v: number[]) {
		if (optional && v === undefined) {
			return;
		}

		const vv = v !== undefined ? v : defaultValue;
		validSuccess = true;
		validError = '';

		if (Array.isArray(vv) && vv.length === 2) {
			const vdMin = validator.safeParse(vv[0]);
			const vdMax = validator.safeParse(vv[1]);

			if (vdMin.success && vdMax.success) {
				if (vdMin.data > vdMax.data) {
					validSuccess = false;
					validError = 'Неверное значение: мин > макс';
					onPropChanged({ success: validSuccess, prop, error: validError });
				} else {
					onPropChanged({
						success: validSuccess,
						value: [vdMin.data, vdMax.data],
						prop,
					});
				}
			} else {
				if (vdMin.success) valMin = vdMin.data;
				if (vdMax.success) valMax = vdMax.data;

				validSuccess = false;
				validError = 'Неверное значение';
				onPropChanged({ success: validSuccess, prop, error: validError });
			}
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
	<div class="flex items-center justify-center gap-1">
		<Input
			id={prop}
			type="number"
			{placeholder}
			class={cn(
				'max-w',
				!validSuccess && 'border-red-500 !ring-transparent',
				small && 'h-6 px-2 text-xs',
			)}
			oninput={onInputChangeMin}
			value={valMin}
		/>
		<span><Icon src={TrOutlineTilde} className={cn(small ? 'h-2 w-2' : 'h-3 w-3')} /></span>
		<Input
			id={prop}
			type="number"
			{placeholder}
			class={cn(
				'max-w',
				!validSuccess && 'border-red-500 !ring-transparent',
				small && 'h-6 px-2 text-xs',
			)}
			oninput={onInputChangeMax}
			value={valMax}
		/>
	</div>
	{#if !validSuccess && validError}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

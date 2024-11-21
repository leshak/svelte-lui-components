<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { IoSearchOutline } from 'svelte-icons-pack/io';

	import { cn } from '$lib/utils.js';

	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
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
		idIsString?: boolean;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		values = [],
		label,
		labelHide = false,
		small = false,
		prop,
		placeholder = 'Выберите значение',
		defaultValue = undefined,
		optional = false,
		idIsString = false,
		onPropChanged = () => {},
	}: Props = $props();

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let filter = $state('');
	const selectedLabel = $derived.by(() => {
		const fixValue = idIsString ? value : parseInt(value, 10);
		return values.find((v) => v.val === fixValue)?.label || placeholder;
	});

	function onSelectedChange(v: any) {
		console.log('v', v);

		onValueChanged(v);
		filter = '';
	}

	function onValueChanged(v: any) {
		let vv = v !== undefined ? v : defaultValue;

		if (!idIsString) {
			vv = parseInt(vv, 10);
		}

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
		}
	}

	onMount(() => {
		onValueChanged(value);
	});
</script>

<div class="flex flex-col">
	{#if !labelHide}
		<Label for={prop} class={cn('mb-2', !validSuccess && 'text-red-500', small && 'mb-0 text-xs')}
			>{label}</Label
		>
	{/if}
	<Select.Root type="single" onValueChange={onSelectedChange} value={String(value)}>
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
			{#if values.length >= 10}
				<div class="relative w-[100%]">
					<Input
						class="mb-1 h-7 w-[100%] border-0 pl-6 pr-2 text-sm"
						placeholder="Поиск (всего {values.length} записей)"
						bind:value={filter}
					/>
					<Icon
						src={IoSearchOutline}
						size="16"
						className="absolute top-1/2 -translate-y-1/2 left-1"
					/>
				</div>
			{/if}

			{#each values.filter((x) => !filter || x.label
						.toLowerCase()
						.includes(filter.toLowerCase())) as v, idx}
				{#if idx < 10}
					<Select.Item value={String(v.val)} class={cn(small && 'h-6 px-2 text-xs')}>
						{v.label}
					</Select.Item>
				{/if}
			{/each}
		</Select.Content>
	</Select.Root>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

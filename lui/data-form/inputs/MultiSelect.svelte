<script lang="ts">
	import { onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { IoSearchOutline } from 'svelte-icons-pack/io';
	import { IoCloseOutline } from 'svelte-icons-pack/io';

	import { cn } from '$lib/utils.js';

	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import type { Selected } from 'bits-ui';
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
		placeholder = 'Выберите значение',
		defaultValue = [],
		optional = false,
		onPropChanged = () => {},
	}: Props = $props();

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	let filter = $state('');
	let val: string[] = $state([]);

	$effect(() => {
		val = values.filter((x) => (value || []).indexOf(x.val) !== -1).map((x) => String(x.val));
	});

	function onSelectedChange(v: string[] | undefined) {
		onValueChanged(v);
	}

	function onValueChanged(v: any) {
		if (optional && v === undefined) {
			return;
		}

		let vv = v !== undefined ? v : defaultValue;
		vv = (vv || []).map((x: string) => parseInt(x, 10));

		validSuccess = true;
		validError = '';

		// проверяем, что выбранное значение есть в списке
		const res = vv.filter((x: any) => values.findIndex((y) => y.val === x) !== -1);
		onPropChanged({ success: validSuccess, value: res, prop });
	}

	function validateInitValue() {
		onValueChanged(value);
	}

	function removeItem(ev: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement }, v: any) {
		ev.preventDefault();
		ev.stopPropagation();

		onValueChanged(val.filter((x: any) => x !== v));
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
	<Select.Root type="multiple" onValueChange={onSelectedChange} value={val}>
		<Select.Trigger
			class={cn(
				'min-h-9 w-[100%] py-1 pl-2 pr-2',
				val?.length > 0 ? 'h-auto pl-1' : small ? 'h-6' : 'h-9 pl-3',
				!validSuccess && 'border-red-500 !ring-transparent',
				small && 'min-h-6 px-2 text-xs',
			)}
		>
			{#if (val || []).length === 0}
				{placeholder}
			{:else}
				<div class="flex flex-wrap gap-1">
					{#each val as item}
						{@const iItem = parseInt(item, 10)}
						<div
							class={cn(
								'flex items-center space-x-1 rounded border border-gray-300 bg-gray-100 pl-2 pr-0.5 text-[13px]',
								small && 'text-xs',
							)}
						>
							<div>{values.find((x) => x.val === iItem)?.label}</div>
							<button title="Удалить" class="opacity-50" onclick={(ev) => removeItem(ev, item)}
								><Icon src={IoCloseOutline} size="12" /></button
							>
						</div>
					{/each}
				</div>
			{/if}
		</Select.Trigger>
		<Select.Content>
			{#if values.length >= 10}
				<div class="relative w-[100%]">
					<Input
						class="mb-1 h-7 w-[100%] border-0 pl-6 pr-2 text-sm"
						placeholder="Поиск"
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
					<Select.Item value={String(v.val)} class={cn(small && 'h-6 px-2 text-xs')}
						>{v.label}</Select.Item
					>
				{/if}
			{/each}
		</Select.Content>
	</Select.Root>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { Icon } from 'svelte-icons-pack';
	import { IoSearchOutline } from 'svelte-icons-pack/io';

	import { cn } from '$lib/utils.js';

	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

	const dispatch = createEventDispatcher();

	export let value: any | string;
	export let values: any[] = [];

	export let label: string;
	export let labelHide: boolean = false;
	export let small: boolean = false;
	export let prop: string;
	export let placeholder: string = '';
	export let defaultValue: any = undefined;
	export let optional: boolean = false;

	let validSuccess: boolean = true;
	let validError: string | undefined = undefined;

	let filter = '';
	let val: { value: string; label: string; disabled: boolean };

	function validateExtValue() {
		onValueChanged(value);
	}

	$: {
		const item = values.find((x) => x.val === value);
		if (item) {
			val = {
				value: item.val,
				label: item.label,
				disabled: item.disabled,
			};
			validateExtValue();
		}
	}

	function onSelectedChange(v: any) {
		onValueChanged(v.value);
		filter = '';
	}

	function onValueChanged(v: any, isInit = false) {
		const vv = v !== undefined ? v : defaultValue;
		validSuccess = true;
		validError = '';

		const idx = values.findIndex((x) => x.val === vv);
		if (idx === -1) {
			if (optional || isInit) {
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

	onMount(() => {
		onValueChanged(value, true);
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
			{#if values.length >= 10}
				<div class="relative w-[100%]">
					<Input
						class="mb-1 h-7 w-[100%] border-0 pl-6 pr-2 text-sm"
						placeholder="Поиск (всего {values.length} записей)"
						autofocus
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
					<Select.Item value={v.val} class={cn(small && 'h-6 px-2 text-xs')}>{v.label}</Select.Item>
				{/if}
			{/each}
		</Select.Content>
		<Select.Input name={prop} />
	</Select.Root>
	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

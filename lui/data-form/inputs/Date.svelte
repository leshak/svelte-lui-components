<script lang="ts">
	import { getLocalTimeZone, parseDate, type DateValue } from '@internationalized/date';
	import { Icon } from 'svelte-icons-pack';
	import { BsCalendar4Event } from 'svelte-icons-pack/bs';

	import { cn } from '$lib/utils.js';

	import { Label } from '$lib/components/ui/label';
	import { buttonVariants } from '$lib/components/ui/button/';
	import * as Popover from '$lib/components/ui/popover/';
	import type { PropChangedEvent } from '../types';
	import LuiCalendar from './elements/LuiCalendar.svelte';

	interface Props {
		value: any | string;
		label: string;
		labelHide?: boolean;
		small?: boolean;
		locale?: string;
		dateStyle?: string;
		prop: string;
		defaultValue?: any;
		disabled?: boolean;
		onPropChanged?: (event: PropChangedEvent) => void;
	}

	let {
		value,
		label,
		labelHide = false,
		small = false,
		locale = 'ru-RU',
		dateStyle = 'medium',
		prop,
		defaultValue = '',
		disabled = false,
		onPropChanged = () => {},
	}: Props = $props();

	const dateFormatter = new Intl.DateTimeFormat(locale, {
		dateStyle: dateStyle,
	});

	let isOpen = $state(false);
	let dateVal: DateValue = $state(parseDate(value || defaultValue));
	let selectedDate: string = $derived(dateFormatter.format(dateVal.toDate(getLocalTimeZone())));

	$effect(() => {
		dateVal = parseDate(value || defaultValue);
	});

	let validSuccess: boolean = $state(true);
	let validError: string | undefined = $state(undefined);

	function onValueChange(v: DateValue) {
		dateVal = v;
		onPropChanged({ success: true, value: v.toString(), prop });
		isOpen = false;
	}

	$inspect(value);
	$inspect(dateVal);
</script>

<div class="flex flex-col">
	{#if !labelHide}
		<Label for={prop} class={cn('mb-2', !validSuccess && 'text-red-500', small && 'mb-0 text-xs')}
			>{label}</Label
		>
	{/if}
	<Popover.Root bind:open={isOpen}>
		<Popover.Trigger
			class={cn(
				buttonVariants({
					variant: 'outline',
					class: 'w-full justify-start text-left font-normal',
				}),
				!value && 'text-muted-foreground',
			)}
		>
			<Icon src={BsCalendar4Event} size="16" className="mr-2" />
			{selectedDate}
		</Popover.Trigger>
		<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
			<LuiCalendar controlledValue value={dateVal} {onValueChange} {locale} />
		</Popover.Content>
	</Popover.Root>

	{#if !validSuccess}
		<div class={cn('text-[0.8rem] text-red-500', small && 'text-[0.7rem]')}>{validError}</div>
	{/if}
</div>

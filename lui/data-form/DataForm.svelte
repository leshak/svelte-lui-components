<script lang="ts">
	import dot from 'dot-object';

	import { DataFormType, type DataFormProp, type PropChangedEvent } from './types';
	import { Label } from '$lib/components/ui/label';
	import { cn } from '$lib/utils.js';

	import Text from './inputs/Text.svelte';
	import Debug from './Debug.svelte';
	import Number from './inputs/Number.svelte';
	import Phone from './inputs/Phone.svelte';
	import Password from './inputs/Password.svelte';
	import NumberMinMax from './inputs/NumberMinMax.svelte';
	import Select from './inputs/Select.svelte';
	import Tag from './inputs/Tag.svelte';
	import MultiSelect from './inputs/MultiSelect.svelte';
	import RadioGroup from './inputs/RadioGroup.svelte';
	import Checkbox from './inputs/Checkbox.svelte';
	import { onMount } from 'svelte';
	import OtpCode from './inputs/OtpCode.svelte';

	dot.keepArray = true;

	interface Props {
		model: any;
		isValid: boolean;
		form?: DataFormProp[];
		tableView?: boolean;
		debug?: number;
	}

	let {
		model = $bindable({}),
		isValid = $bindable(),
		form = [],
		tableView = false,
		debug = 0,
	}: Props = $props();

	let isValidByProps: any = {};

	// dotted model
	let planeModel: any = $state(dot.dot(model));
	let keepModelPointer: any = $state();

	// $effect.pre(() => {
	// 	console.log('$effect.pre');
	// });

	$effect(() => {
		if (keepModelPointer !== model) {
			planeModel = dot.dot(model);
		}
	});

	function onPropChanged(event: PropChangedEvent) {
		const { value, prop, success, error } = event;

		if (success && planeModel[prop] !== value) {
			planeModel = {
				...planeModel,
				[prop]: value,
			};
			keepModelPointer = { ...planeModel };

			dot.object(keepModelPointer);
			model = keepModelPointer;
		}
		isValidByProps[prop] = success;
		isValid = Object.keys(isValidByProps).every((key) => isValidByProps[key]);
	}
</script>

{#if tableView}
	<!-- View as table -->
	<div class="bg-white">
		<table class="w-full">
			<tbody>
				{#each form as item}
					{#if !item.hide}
						<tr>
							{#if item.type === DataFormType.Divider}
								<td colspan={2} class="pt-1">
									<div
										class={cn('rounded-md bg-primary py-1 pl-2 pr-2 text-xs font-bold text-white')}
									>
										{item.label}
									</div>
								</td>
							{:else}
								<td class={cn('w-[50%] pr-2 text-right text-xs')}>
									{item.label}
								</td>
							{/if}
							{#if item.type !== DataFormType.Divider}
								<td class="py-1.5">
									{#if item.type === DataFormType.Text}
										<Text {...item} value={planeModel[item.prop]} {onPropChanged} labelHide small />
									{:else if item.type === DataFormType.Number}
										<Number
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else if item.type === DataFormType.Phone}
										<Phone
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else if item.type === DataFormType.Password}
										<Password
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else if item.type === DataFormType.NumberMinMax}
										<NumberMinMax
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else if item.type === DataFormType.Select}
										<Select
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else if item.type === DataFormType.Tag}
										<Tag {...item} value={planeModel[item.prop]} {onPropChanged} labelHide small />
									{:else if item.type === DataFormType.MultiSelect}
										<MultiSelect
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else if item.type === DataFormType.RadioGroupInt}
										<RadioGroup
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											intType
											labelHide
											small
										/>
									{:else if item.type === DataFormType.Checkbox}
										<Checkbox
											{...item}
											value={planeModel[item.prop]}
											{onPropChanged}
											labelHide
											small
										/>
									{:else}
										<div class="grid gap-2">
											<Label for={item.prop}>{item.label} - Unknown</Label>
										</div>
									{/if}
								</td>
							{/if}
						</tr>
					{/if}
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<!-- View as form -->
	<div class="grid grid-cols-[repeat(24,1fr)] gap-3 bg-white">
		{#each form as item}
			{#if !item.hide}
				<div class="grid gap-[2]" style="grid-column: span {item.span || 24};">
					{#if item.type === DataFormType.Text}
						<Text {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.OtpCode}
						<OtpCode {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.Number}
						<Number {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.Phone}
						<Phone {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.Password}
						<Password {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.NumberMinMax}
						<NumberMinMax {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.Select}
						<Select {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.Tag}
						<Tag {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.MultiSelect}
						<MultiSelect {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else if item.type === DataFormType.RadioGroupInt}
						<RadioGroup {...item} value={planeModel[item.prop]} {onPropChanged} intType />
					{:else if item.type === DataFormType.Checkbox}
						<Checkbox {...item} value={planeModel[item.prop]} {onPropChanged} />
					{:else}
						<div class="grid gap-2">
							<Label for={item.prop}>{item.label} - Unknown</Label>
						</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
{/if}

{#if debug}
	<Debug {model} />
	{#if debug > 1}
		<Debug model={planeModel} />
	{/if}
{/if}

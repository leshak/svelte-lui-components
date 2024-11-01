<script lang="ts">
	import type { TableColumn, TableGroupColumn } from './types';
	import * as Table from './ui/';
	import { cn } from '$lib/utils.js';

	import { Icon } from 'svelte-icons-pack';
	import { HiOutlineChevronUpDown } from 'svelte-icons-pack/hi';
	import { BsArrowUp } from 'svelte-icons-pack/bs';
	import { BsArrowDown } from 'svelte-icons-pack/bs';

	interface Props {
		row1?: TableGroupColumn[];
		row2?: TableColumn[];
		sortProp?: string;
		sortOrder?: number;
	}

	let {
		row1 = [],
		row2 = [],
		sortProp = $bindable(''),
		sortOrder = $bindable(0),
	}: Props = $props();

	function onSwitchSort(prop: string) {
		if (sortProp === prop) {
			sortOrder *= -1;
		} else {
			sortProp = prop;
			sortOrder = 1;
		}
	}
</script>

<Table.Header>
	{#if row1.length > 0}
		<Table.Row>
			{#each row1 as it}
				<Table.Head0 colspan={it.span}>{it.name}</Table.Head0>
			{/each}
		</Table.Row>
	{/if}
	{#if row2.length > 0}
		<Table.Row>
			{#each row2 as it, idx}
				<Table.Head>
					<div class="flex flex-nowrap justify-between">
						<span class="whitespace-nowrap">{it.name}</span>
						{#if it.sort}
							<button
								class={cn(
									'-mr-1 ml-2 opacity-35 transition-all hover:opacity-100',
									it.prop === sortProp && 'opacity-100',
								)}
								onclick={() => onSwitchSort(it.prop)}
							>
								{#if it.prop === sortProp}
									<Icon src={sortOrder === 1 ? BsArrowUp : BsArrowDown} size="12" />
								{:else}
									<Icon src={HiOutlineChevronUpDown} size="14" />
								{/if}
							</button>
						{/if}
					</div>
				</Table.Head>
			{/each}
		</Table.Row>
	{/if}
</Table.Header>

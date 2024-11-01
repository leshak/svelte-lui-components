<script lang="ts">
	import dayjs from 'dayjs';
	import { cn } from '$lib/utils.js';

	import * as Table from '../ui/';
	import type { TableColumn } from '../types';

	interface Props {
		item: any;
		value: any;
		col: TableColumn;
	}

	let { item, value, col }: Props = $props();

	let showValue = $derived.by(() => {
		let val = value;

		// renderText
		if (val !== undefined && col.renderText !== undefined) {
			val = col.renderText(val, item);
		}

		// type == 'date'
		if (val !== undefined && col.type === 'date') {
			if (col.format !== undefined) {
				val = dayjs(val).format(col.format);
			} else {
				val = new Date(val).toLocaleDateString();
			}
		}

		// скрыть =0
		if (col.hideZero && parseInt(String(val), 10) === 0) {
			val = '';
		}

		// fix undefined
		if (val === undefined) {
			val = '';
		}

		return val;
	});
</script>

<Table.Cell style="text-align:{col.align || 'left'}">
	{#if col.type === 'check'}
		{#if !!showValue}
			<span class="inline-block">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 16 16"
					style="color: currentColor;"
					stroke-width="0"
					fill="currentColor"
					stroke="currentColor"
					><path
						d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"
					></path></svg
				>
			</span>
		{/if}
	{:else}
		<div class={cn(col.nowrap && 'whitespace-nowrap')}>
			{showValue}
		</div>
	{/if}
</Table.Cell>

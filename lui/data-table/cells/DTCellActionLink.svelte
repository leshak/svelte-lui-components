<script lang="ts">
	import gv from 'get-value';
	import { Icon } from 'svelte-icons-pack';
	import { CiEdit } from 'svelte-icons-pack/ci';

	import * as Table from '../ui';
	import type { TableColumn } from '../types';

	interface Props {
		item: any;
		value: any;
		col: TableColumn;
	}

	let { item, col }: Props = $props();

	let linkUrl = $state('');

	$effect(() => {
		if (col.actionLink !== undefined) {
			const v = gv(item, col.prop);
			linkUrl = col.actionLink(v, item);
		}
	});
</script>

<Table.Cell class="w-8 p-0 opacity-70 hover:text-primary hover:opacity-100">
	<a
		href={linkUrl}
		class="hint--right block px-2 py-1.5 align-middle"
		aria-label={col.actionHint || ''}
	>
		<Icon src={col.actionIcon || CiEdit} size="16" />
	</a>
</Table.Cell>

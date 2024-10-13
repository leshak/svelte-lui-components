<script lang="ts">
	import { onMount } from 'svelte';
	import { derived, writable } from 'svelte/store';
	import LZString from 'lz-string';
	import gv from 'get-value';

	import type {
		TableColumn,
		DataTableColumns,
		TableGroupColumn,
		DataTableOptions,
		DataTableApiLoader,
	} from './types';
	import * as Table from './ui/';
	import { columnsPrep } from './data-prep';
	import DataTableHeader from './DataTableHeader.svelte';
	import DataTableCtrls from './DataTableCtrls.svelte';
	import DtCellSimple from './cells/DTCellSimple.svelte';
	import DtCellActionLink from './cells/DTCellActionLink.svelte';
	import DtFilderDialog from './filter/DTFilderDialog.svelte';
	import type { DataFormProp } from '../data-form/types';
	import type { Readable } from 'svelte/motion';

	export let apiLoader: DataTableApiLoader;
	export let columns: DataTableColumns;
	export let options: DataTableOptions = {};
	export let filterForm: DataFormProp[];
	export let initFilter: any = {};
	export let excelEnable: boolean = false;

	// Колонки для вывода
	let row1: TableGroupColumn[] = [];
	let row2: TableColumn[] = [];

	// текущее состояние таблицы
	let initDone = writable(false);
	let partId = writable('');
	let page = writable(1);
	let pageSize = writable(20);
	let sortProp = writable('_id');
	let sortOrder = writable(1);
	let hashFilter = writable('');

	const tableHashState = derived(
		[page, pageSize, sortProp, sortOrder, partId, hashFilter],
		([$page, $pageSize, $sortProp, $sortOrder, $partId, $hashFilter], set) => {
			set(`${$page},${$pageSize},${$sortProp},${$sortOrder},${$partId},${$hashFilter}`);
		},
	) as Readable<string>;

	function toPage1(sp: string, so: number) {
		$page = 1;
	}
	$: {
		// reset if sort changed
		toPage1($sortProp, $sortOrder);
	}

	let props: string[] = ['_id', 'name'];
	let total: number = 0;
	let items: any[] = [];

	// excel
	let loadExcelExport = false;
	let openExcelExport = false;

	$: {
		if (!loadExcelExport && openExcelExport) {
			loadExcelExport = true;
		}
	}

	// filter
	let openFilter = false;
	let filter = {};

	$: {
		filter = { ...initFilter };
	}

	function onApplyFilter(ev: CustomEvent) {
		const { detail } = ev;
		if (detail?.isValid) {
			openFilter = false;
			filter = detail.filter;
			$hashFilter = LZString.compressToEncodedURIComponent(JSON.stringify(filter || {}));
		}
	}

	async function loadData(hash: string = '', initDone = false) {
		if (!initDone) return;
		// console.log('loadingData', hash);

		const data = await apiLoader(filter, $page, $pageSize, props, $sortProp, $sortOrder);
		total = data.total;
		items = [...data.list];

		// console.log('Load done', data.page, data.total);
	}

	$: {
		loadData($tableHashState, $initDone);
	}

	function onForceLoadData() {
		loadData($tableHashState, $initDone);
	}

	onMount(() => {
		// инициализация
		if (options.initSort) {
			$sortProp = options.initSort[0];
			$sortOrder = options.initSort[1];
		}

		if (columns.parts.length > 0) {
			$partId = columns.parts[0].id || '';
		}
	});

	$: {
		const prep = columnsPrep(columns, $partId);
		if (prep) {
			// Колонки для вывода
			row1 = prep.row1;
			row2 = prep.row2;
			props = prep.props;

			// обновляем состояние таблицы
			$initDone = true;
		}
	}
</script>

<!-- Controls -->
<DataTableCtrls
	{columns}
	{total}
	{excelEnable}
	bind:openExcelExport
	bind:partId={$partId}
	bind:page={$page}
	bind:pageSize={$pageSize}
	bind:openFilter
	on:dtable-apply-filter={onApplyFilter}
	filterActive={Object.keys(filter).length > 0}
	on:dtable-force-load-data={onForceLoadData}
/>

<Table.Root class="border bg-white">
	<!-- Header -->
	<DataTableHeader {row1} {row2} bind:sortProp={$sortProp} bind:sortOrder={$sortOrder} />

	<!-- Body -->
	<Table.Body>
		{#each items || [] as item}
			<Table.Row>
				{#each row2 as col}
					{@const value = gv(item, col.prop, { default: col.defaultValue })}

					{#if col.actionLink !== undefined}
						<DtCellActionLink {col} {item} {value} />
					{:else if col.component !== undefined}
						<Table.Cell
							class="w-8 p-0 opacity-70 hover:text-primary hover:opacity-100"
							style="text-align: {col.align || 'left'}"
						>
							<svelte:component this={col.component} {col} {item} {value} />
						</Table.Cell>
					{:else}
						<DtCellSimple {col} {item} {value} />
					{/if}
				{/each}
			</Table.Row>
		{/each}
	</Table.Body>
</Table.Root>

{#if initDone}
	<DtFilderDialog
		bind:open={openFilter}
		{filter}
		{filterForm}
		on:dtable-apply-filter={onApplyFilter}
	/>
{/if}

{#if excelEnable && loadExcelExport}
	{#await import('./excel/ExcelExportDialog.svelte') then c}
		<svelte:component
			this={c.default}
			bind:open={openExcelExport}
			{apiLoader}
			{row1}
			{row2}
			{filter}
			{total}
			{props}
			sortProp={$sortProp}
			sortOrder={$sortOrder}
		/>
	{/await}
{/if}

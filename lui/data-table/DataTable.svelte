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
	import { columnsPrep } from './data-prep';
	import type { DataFormProp } from '../data-form/types';
	import type { Readable } from 'svelte/motion';

	import * as Table from './ui/';
	import DataTableHeader from './DataTableHeader.svelte';
	import DataTableCtrls from './DataTableCtrls.svelte';
	import DtCellSimple from './cells/DTCellSimple.svelte';
	import DtCellActionLink from './cells/DTCellActionLink.svelte';
	import DtFilderDialog from './filter/DTFilderDialog.svelte';

	interface Props {
		apiLoader: DataTableApiLoader;
		columns: DataTableColumns;
		options?: DataTableOptions;
		filterForm: DataFormProp[];
		initFilter?: any;
		excelEnable?: boolean;
	}

	let {
		apiLoader,
		columns,
		options = {},
		filterForm,
		initFilter = {},
		excelEnable = false,
	}: Props = $props();

	// Колонки для вывода
	let row1: TableGroupColumn[] = $state([]);
	let row2: TableColumn[] = $state([]);

	// текущее состояние таблицы
	let initDone = writable(false);
	let partId = writable('');
	let tablePage = writable(1);
	let pageSize = writable(20);
	let sortProp = writable('_id');
	let sortOrder = writable(1);
	let hashFilter = writable('');

	const tableHashState = derived(
		[tablePage, pageSize, sortProp, sortOrder, partId, hashFilter],
		([$page, $pageSize, $sortProp, $sortOrder, $partId, $hashFilter], set) => {
			set(`${$page},${$pageSize},${$sortProp},${$sortOrder},${$partId},${$hashFilter}`);
		},
	) as Readable<string>;

	function toPage1(sp: string, so: number) {
		$tablePage = 1;
	}
	$effect(() => {
		// reset if sort changed
		toPage1($sortProp, $sortOrder);
	});

	let modelProps: string[] = $state(['_id', 'name']);
	let total: number = $state(0);
	let items: any[] = $state([]);

	// excel
	let loadExcelExport = $state(false);
	let openExcelExport = $state(false);

	$effect(() => {
		if (!loadExcelExport && openExcelExport) {
			loadExcelExport = true;
		}
	});

	// filter
	let openFilter = $state(false);
	let filter = $state({});

	$effect(() => {
		filter = { ...initFilter };
	});

	function onApplyFilter(ev: any) {
		const { isValid, filterValue } = ev;
		if (isValid) {
			openFilter = false;
			filter = filterValue;
			$hashFilter = LZString.compressToEncodedURIComponent(JSON.stringify(filter || {}));
		}
	}

	async function loadData(hash: string = '', initDone = false) {
		if (!initDone) return;
		// console.log('loadingData', hash);

		const data = await apiLoader(filter, $tablePage, $pageSize, modelProps, $sortProp, $sortOrder);
		total = data.total;
		items = [...data.list];

		// console.log('Load done', data.page, data.total);
	}

	$effect(() => {
		loadData($tableHashState, $initDone);
	});

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

	$effect(() => {
		const prep = columnsPrep(columns, $partId);
		if (prep) {
			// Колонки для вывода
			row1 = prep.row1;
			row2 = prep.row2;
			modelProps = prep.props;

			// обновляем состояние таблицы
			$initDone = true;
		}
	});
</script>

<!-- Controls -->
<DataTableCtrls
	{columns}
	{total}
	{excelEnable}
	bind:openExcelExport
	bind:partId={$partId}
	bind:page={$tablePage}
	bind:pageSize={$pageSize}
	bind:openFilter
	{onApplyFilter}
	filterActive={Object.keys(filter).length > 0}
	{onForceLoadData}
/>

<Table.Root class="border bg-white">
	<DataTableHeader {row1} {row2} bind:sortProp={$sortProp} bind:sortOrder={$sortOrder} />

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
							<col.component {col} {item} {value} />
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
	<DtFilderDialog bind:open={openFilter} {filter} {filterForm} {onApplyFilter} />
{/if}

{#if excelEnable && loadExcelExport}
	{#await import('./excel/ExcelExportDialog.svelte') then c}
		<c.default
			bind:open={openExcelExport}
			{apiLoader}
			{row1}
			{row2}
			{filter}
			{total}
			props={modelProps}
			sortProp={$sortProp}
			sortOrder={$sortOrder}
		/>
	{/await}
{/if}

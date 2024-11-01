<script lang="ts">
	import ProgressBar from '@okrad/svelte-progressbar';

	import type { DataTableApiLoader, TableColumn, TableGroupColumn } from '../types';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { roundPlus } from '$utils/common';
	import { eeAddPage, eeCreateHeader, eeInit, eeSaveFile } from './excel_export';

	const ExcelExportStep = 20; // размер выгрузки за шаг

	interface Props {
		open?: boolean;
		apiLoader: DataTableApiLoader;
		filter?: object;
		total?: number;
		props?: string[];
		sortProp?: string;
		sortOrder?: number;
		row1?: TableGroupColumn[];
		row2?: TableColumn[];
	}

	let {
		open = $bindable(false),
		apiLoader,
		filter = {},
		total = 0,
		props = [],
		sortProp = '',
		sortOrder = 0,
		row1 = [],
		row2 = [],
	}: Props = $props();

	let progress = $state(0);
	let breakExport = $state(false);

	async function loadData(page: number) {
		console.log('load Page', page);

		const data = await apiLoader(filter, page, ExcelExportStep, props, sortProp, sortOrder);
		return data.list;
	}

	async function startExport() {
		progress = 1;
		const pages = Math.ceil(total / ExcelExportStep);
		const progressStep = 90 / pages;

		// create EE
		const eeData = eeInit(row1, row2, total);
		progress++;

		// generate table header
		eeCreateHeader(eeData);
		progress++;

		for (let i = 1; i <= pages; i++) {
			const list = await loadData(i);

			await eeAddPage(eeData, list);

			progress = roundPlus(progress + progressStep, 0);
			if (breakExport) return;
		}

		await eeSaveFile(eeData);
		progress = 100;
	}

	function closeDialog() {
		open = false;
		breakExport = true;
	}

	$effect(() => {
		if (open) {
			progress = 0;
			breakExport = false;
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="top-[20%] translate-y-[-20%] p-4 sm:max-w-[335px]">
		<Dialog.Header>
			<Dialog.Title>Экспорт в Excel</Dialog.Title>
		</Dialog.Header>
		<div class="mx-auto flex h-[220px] w-[220px] items-center justify-center p-4">
			<ProgressBar
				series={[
					{
						perc: progress,
						color: '#008fcc',
					},
				]}
				style="radial"
			/>
		</div>
		<Dialog.Footer>
			<Button variant="outline" onclick={closeDialog}>Закрыть</Button>
			{#if progress === 0}
				<Button onclick={startExport}>Экспорт</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

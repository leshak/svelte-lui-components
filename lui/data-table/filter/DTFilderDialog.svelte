<script lang="ts">
	import { DataForm } from '$lib/components/lui/data-form';
	import type { DataFormProp } from '../../data-form/types';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	interface Props {
		open?: boolean;
		filter?: any;
		filterForm?: DataFormProp[];
		onApplyFilter: (ev: any) => void;
	}

	let { open = $bindable(false), filter = {}, filterForm = [], onApplyFilter }: Props = $props();

	let isValid = $state(true);
	let filterModel = $state({});

	function onLoadFilter() {
		filterModel = { ...filter };
	}

	$effect(() => {
		if (open) {
			onLoadFilter();
		}
	});

	function setFilter(ev: Event) {
		ev.preventDefault();
		onApplyFilter({ filterValue: filterModel, isValid: true });
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="top-[20%] translate-y-[-20%] p-4 sm:max-w-[625px]">
		<Dialog.Header>
			<Dialog.Title>Фильтрация объектов</Dialog.Title>
		</Dialog.Header>
		{#if open}
			<DataForm bind:model={filterModel} bind:isValid form={filterForm} tableView debug={0} />
		{/if}
		<Dialog.Footer>
			<Button variant="outline" onclick={() => (open = false)}>Отмена</Button>
			<Button disabled={!isValid} onclick={setFilter}>Применить</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { DataForm } from '$lib/components/lui/data-form';
	import type { DataFormProp } from '../../data-form/types';

	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	const dispatch = createEventDispatcher();

	export let open: boolean = false;
	export let filter: any = {};
	export let filterForm: DataFormProp[] = [];

	let isValid = true;
	let filterModel = {};

	function onLoadFilter() {
		filterModel = { ...filter };
	}

	$: {
		if (open) {
			onLoadFilter();
		}
	}

	function onApplyFilter(ev: Event) {
		ev.preventDefault();
		dispatch('dtable-apply-filter', { filter: filterModel, isValid });
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
			<Button variant="outline" on:click={() => (open = false)}>Отмена</Button>
			<Button disabled={!isValid} on:click={onApplyFilter}>Применить</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

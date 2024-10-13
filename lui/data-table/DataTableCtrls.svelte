<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import type { DataTableColumns } from './types';

	import { Icon } from 'svelte-icons-pack';
	import { AiOutlineAppstore } from 'svelte-icons-pack/ai';
	import { HiSolidChevronLeft } from 'svelte-icons-pack/hi';
	import { HiSolidChevronRight } from 'svelte-icons-pack/hi';
	import { BiRefresh } from 'svelte-icons-pack/bi';
	import { IoCloseOutline } from 'svelte-icons-pack/io';
	import { LuFilter } from 'svelte-icons-pack/lu';
	import { ImFileExcel } from 'svelte-icons-pack/im';

	type ItemsPerPage = { value: number; label: string };

	const dispatch = createEventDispatcher();

	// params
	export let columns: DataTableColumns;

	export let partId: string = '';
	export let pageSize: number = 20;
	export let page: number = 1;
	export let total: number = 0;

	export let openFilter: boolean = false;
	export let filterActive: boolean = false;

	export let openExcelExport: boolean = false;
	export let excelEnable: boolean = false;

	// init
	let itemsPerPageValue: ItemsPerPage = { value: pageSize, label: `${pageSize} / page` };

	const itemsPerPage: ItemsPerPage[] = [
		{ value: 10, label: '10 / page' },
		{ value: 20, label: '20 / page' },
		{ value: 50, label: '50 / page' },
		{ value: 100, label: '100 / page' },
		{ value: 500, label: '500 / page' },
	];

	function onItemsPerPageChange(v: any) {
		itemsPerPageValue = v;
		pageSize = v.value;
		// dispatch('dtable-pagesize-changed', { pageSize: v.value });
	}

	function onResetFilter(ev: Event) {
		ev.preventDefault();
		dispatch('dtable-apply-filter', { filter: {}, isValid: true });
	}

	function onPageChange(page: number) {
		dispatch('dtable-page-changed', { page });
	}
</script>

<div class="mb-3 flex w-full">
	<div class="flex gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					variant="outline"
					size="icon"
					class="hint--bottom h-7 w-8"
					aria-label="Выбрать вид"
				>
					<Icon src={AiOutlineAppstore} size="16" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" side="right" align="end">
				<DropdownMenu.RadioGroup bind:value={partId}>
					{#each columns.parts as part}
						<DropdownMenu.RadioItem value={part.id || '----'}>{part.name}</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<!-- <Input type="text" placeholder="Поиск" class="h-7 max-w-xs bg-white" /> -->
		{#if excelEnable}
			<Button
				variant="outline"
				size="icon"
				class="hint--bottom h-7 w-7"
				aria-label="Выгрузка данных в Excel"
				on:click={() => (openExcelExport = true)}
			>
				<Icon src={ImFileExcel} size="16" />
			</Button>
		{/if}
	</div>

	<div class="ml-auto flex gap-2">
		<!-- filter -->
		<div class="flex gap-1">
			<Button
				variant={filterActive ? 'default' : 'outline'}
				size="icon"
				class="hint--bottom h-7 w-7"
				on:click={() => (openFilter = true)}
				aria-label="Установить фильтр"
			>
				<Icon src={LuFilter} size="16" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="hint--bottom h-7 w-7"
				on:click={onResetFilter}
				aria-label="Сбросить фильтр"
			>
				<Icon src={IoCloseOutline} size="16" />
			</Button>
		</div>

		<!-- pagination -->
		<div class="flex gap-1">
			<Button
				variant="ghost"
				class="hint--bottom h-7"
				on:click={() => dispatch('dtable-force-load-data')}
				aria-label="Обновить данные"
			>
				<Icon src={BiRefresh} size="16" className="mr-1" />
				{total}
			</Button>

			{#if total > 0}
				<Pagination.Root
					{onPageChange}
					bind:page
					count={total}
					perPage={pageSize}
					siblingCount={1}
					let:pages
					let:currentPage
				>
					<Pagination.Content class="gap-0">
						<Pagination.Item>
							<Pagination.PrevButton class="h-7 w-auto px-2">
								<Icon src={HiSolidChevronLeft} size="16" />
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis class="h-7 w-auto px-2" />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link
										{page}
										isActive={currentPage === page.value}
										class="h-7 w-auto px-2"
									>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton class="h-7 w-auto px-2">
								<Icon src={HiSolidChevronRight} size="16" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				</Pagination.Root>
			{/if}
		</div>

		<!-- items per page menu -->
		<Select.Root onSelectedChange={onItemsPerPageChange} selected={itemsPerPageValue}>
			<Select.Trigger class="h-7 w-[120px] bg-white pl-2 pr-1">
				<Select.Value placeholder="Выберите" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each itemsPerPage as it}
						<Select.Item value={it.value} label={it.label}>{it.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
			<Select.Input name="currentItemsPerPage" value={itemsPerPageValue} />
		</Select.Root>
	</div>
</div>

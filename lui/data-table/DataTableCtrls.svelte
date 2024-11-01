<script lang="ts">
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
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

	type ItemsPerPage = { value: string; label: string };

	interface Props {
		// params
		columns: DataTableColumns;
		partId?: string;
		pageSize?: number;
		page?: number;
		total?: number;
		openFilter?: boolean;
		filterActive?: boolean;
		openExcelExport?: boolean;
		excelEnable?: boolean;
		onApplyFilter?: (ev: any) => void;
		onForceLoadData?: () => void;
	}

	let {
		columns,
		partId = $bindable(''),
		pageSize = $bindable(20),
		page = $bindable(1),
		total = 0,
		openFilter = $bindable(false),
		filterActive = false,
		openExcelExport = $bindable(false),
		excelEnable = false,
		onApplyFilter = (ev: any) => {},
		onForceLoadData = () => {},
	}: Props = $props();

	const itemsPerPage: ItemsPerPage[] = [
		{ value: '10', label: '10 / page' },
		{ value: '20', label: '20 / page' },
		{ value: '50', label: '50 / page' },
		{ value: '100', label: '100 / page' },
		{ value: '500', label: '500 / page' },
	];

	// init
	let itemsPerPageValue: string = $state(String(pageSize));
	const perPagePlaceholder = $derived(
		itemsPerPage.find((f) => f.value === itemsPerPageValue)?.label ?? 'Выберите',
	);

	function onItemsPerPageChange(v: any) {
		itemsPerPageValue = v;
		pageSize = parseInt(v, 10);
	}

	function onResetFilter(ev: Event) {
		ev.preventDefault();
		onApplyFilter({ filterValue: {}, isValid: true });
	}
</script>

<div class="mb-3 flex w-full">
	<div class="flex gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				class={buttonVariants({
					variant: 'outline',
					size: 'icon',
					className: 'hint--bottom h-7 w-7',
				})}
				aria-label="Выбрать вид"
			>
				<Icon src={AiOutlineAppstore} size="16" />
			</DropdownMenu.Trigger>
			<DropdownMenu.Content class="w-56" side="right" align="start">
				<DropdownMenu.RadioGroup bind:value={partId}>
					{#each columns.parts as part}
						<DropdownMenu.RadioItem value={part.id || '----'}>{part.name}</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		{#if excelEnable}
			<Button
				variant="outline"
				size="icon"
				class="hint--bottom h-7 w-7"
				aria-label="Выгрузка данных в Excel"
				onclick={() => (openExcelExport = true)}
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
				onclick={() => (openFilter = true)}
				aria-label="Установить фильтр"
			>
				<Icon src={LuFilter} size="16" />
			</Button>
			<Button
				variant="outline"
				size="icon"
				class="hint--bottom h-7 w-7"
				onclick={onResetFilter}
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
				onclick={onForceLoadData}
				aria-label="Обновить данные"
			>
				<Icon src={BiRefresh} size="16" className="mr-1" />
				{total}
			</Button>

			{#if total > 0}
				<Pagination.Root bind:page count={total} perPage={pageSize} siblingCount={1}>
					{#snippet children({ pages, currentPage })}
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
					{/snippet}
				</Pagination.Root>
			{/if}
		</div>

		<!-- items per page menu -->
		<Select.Root type="single" onValueChange={onItemsPerPageChange} value={itemsPerPageValue}>
			<Select.Trigger class="h-7 w-[100px] bg-white pl-2 pr-1">{perPagePlaceholder}</Select.Trigger>
			<Select.Content>
				<Select.Group>
					{#each itemsPerPage as it}
						<Select.Item value={String(it.value)} label={it.label}>{it.label}</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</div>
</div>

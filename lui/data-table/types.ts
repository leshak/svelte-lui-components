import type { IconType } from 'svelte-icons-pack';

export interface DataTableColumns {
	common: DataTablePart;
	parts: DataTablePart[];
}

export interface DataTablePart {
	id?: string;
	name?: string;
	props: string[];
	columns: TableColumn[];
}

export interface TableColumn {
	group?: [string, number];
	name: string;
	prop: string;
	nowrap?: boolean;
	class?: string;
	type?: string;
	format?: string;
	align?: string;
	sort?: boolean;
	sortDir?: number;
	hideZero?: boolean;
	defaultValue?: string | number | number[] | boolean | string[] | number[];
	payload?: any;
	// actions
	actionIcon?: IconType;
	actionHint?: string;
	actionLink?: (value: string | number | number[] | object | undefined, item?: object) => string;
	// render
	renderText?: (value: string | number | number[] | object | undefined, item?: object) => string;
	component?: any;
	excel?: (
		value: string | number | number[] | object | undefined,
		item?: object,
		col?: TableColumn,
	) => string;
}

export interface TableGroupColumn {
	name: string;
	span: number;
}

export interface DataTableOptions {
	initSort?: [string, number];
}

export type DataTableApiLoaderResult = {
	total: number;
	page: number;
	pageSize: number;
	list: object[];
};

export type DataTableApiLoader = (
	filter: object,
	page: number,
	pageSize: number,
	props: string[],
	sortProp: string,
	sortOrder: number,
) => Promise<DataTableApiLoaderResult>;

import type { TableColumn, DataTableColumns, TableGroupColumn } from './types';

export function columnsPrep(columns: DataTableColumns, partId: string) {
	if (!partId) return;

	let props: string[] = [];
	const row1: TableGroupColumn[] = [];
	const row2: TableColumn[] = [];

	// row1 - Группы
	props = [...props, ...(columns?.common?.props || [])];

	columns?.common?.columns?.map((c) => {
		if (c.group && Array.isArray(c.group)) {
			row1.push({
				name: c.group[0],
				span: c.group[1],
			});
		}

		row2.push({
			...c,
			prop: c.prop.indexOf('+') === 0 ? c.prop.substring(1) : c.prop,
			sortDir: 0,
		});

		// props
		if (c.prop && c.prop.indexOf('+') === 0) props.push(c.prop.substring(1));
	});

	const part = columns.parts.find((p) => p.id === partId);
	if (part) {
		// props
		props = [...props, ...(part.props || [])];

		// row1
		part.columns?.map((c) => {
			if (c.group && Array.isArray(c.group)) {
				row1.push({
					name: c.group[0],
					span: c.group[1],
				});
			}

			row2.push({
				...c,
				prop: c.prop.indexOf('+') === 0 ? c.prop.substring(1) : c.prop,
				sortDir: 0,
			});

			// props
			if (c.prop && c.prop.indexOf('+') === 0) props.push(c.prop.substring(1));
		});
	}

	return {
		row1,
		row2,
		props,
	};
}

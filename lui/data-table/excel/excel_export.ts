import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import gv from 'get-value';

import type { TableColumn, TableGroupColumn } from '../types';

type TExcelExportData = {
	workbook: ExcelJS.Workbook;
	sheet: ExcelJS.Worksheet;
	row1: TableGroupColumn[];
	row2: TableColumn[];
	total: number;
	currentRow: number;
};

export const eeInit = (
	row1: TableGroupColumn[],
	row2: TableColumn[],
	total: number,
): TExcelExportData => {
	// create a new workbook
	const workbook = new ExcelJS.Workbook();

	// create new worksheet
	const sheet = workbook.addWorksheet('Выгрузка', {
		pageSetup: { paperSize: 9, orientation: 'landscape' },
	});

	return {
		workbook,
		sheet,
		row1,
		row2,
		total,
		currentRow: 1,
	};
};

export const eeCreateHeader = (eeData: TExcelExportData) => {
	// header 1
	let colN = 1;
	for (const col of eeData.row1) {
		const cell = eeData.sheet.getCell(1, colN);
		cell.value = col.name;
		cell.font = { size: 13, bold: true, color: { argb: 'FF606070' } };
		cell.border = {
			left: { style: 'thin' },
			right: { style: 'thin' },
		};

		eeData.sheet.mergeCells(1, colN, 1, colN + col.span - 1);
		colN += col.span;
	}

	// header 2
	colN = 1;
	for (const col of eeData.row2) {
		const cell = eeData.sheet.getCell(2, colN);
		cell.value = col.name;
		cell.font = { size: 14, bold: true };
		cell.border = {
			top: { style: 'thin' },
			left: { style: 'thin' },
			bottom: { style: 'medium' },
			right: { style: 'thin' },
		};

		colN += 1;
	}

	// data
	eeData.currentRow = 3;
};

export const eeSaveFile = async (eeData: TExcelExportData) => {
	// autosize columns
	eeData.sheet.columns.forEach((column) => {
		const lengths = column.values?.map((v) => v?.toString().length) || [];
		const maxLength = Math.max(...lengths.filter((v) => typeof v === 'number'));
		column.width = maxLength;
	});

	const buffer = await eeData.workbook.xlsx.writeBuffer();
	saveAs(new Blob([buffer]), 'export.xlsx');
};

export const eeAddPage = async (eeData: TExcelExportData, list: object[]) => {
	for (let i = 0; i < list.length; i++) {
		const item = list[i];
		let colN = 1;
		for (const col of eeData.row2) {
			if (col.actionLink === undefined) {
				let value = gv(item, col.prop, { default: col.defaultValue });

				if (col.excel) value = col.excel(value, item, col);
				else if (col.type === 'check') value = value ? '+' : '';

				const cell = eeData.sheet.getCell(eeData.currentRow, colN);
				cell.value = value !== undefined ? value : '';
			}

			colN += 1;
		}

		eeData.currentRow += 1;
	}
};

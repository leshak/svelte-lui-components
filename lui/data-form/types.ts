export interface DataFormProp {
	type: number;
	label: string;
	prop: string;
	span?: number;
	defaultValue?: string | number | boolean | string[] | number[];
	optional?: boolean;
	placeholder?: string;
	values?: string[] | DataFormPropSelectId[];
	vertical?: boolean;
	intType?: boolean;
	hide?: boolean;
	labelHide?: boolean;
	autoFocus?: boolean;
}

export interface DataFormPropSelectId {
	val: number | string;
	label: string;
}

export const DataFormType = {
	Text: 0,
	Number: 1,
	Tag: 2,
	Select: 3,
	MultiSelect: 4,
	RadioGroupInt: 5,
	RadioGroupString: 6,
	Checkbox: 7,
	Switch: 8,
	Date: 9,
	Divider: 10,
	NumberMinMax: 11,
	Phone: 12,
	Password: 13,
};

export type TSelectItem = {
	val: number | string;
	label: string;
};

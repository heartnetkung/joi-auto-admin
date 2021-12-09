const generateId = () => {
  return Math.floor(Math.random() * 90000) + 10000;
}

export const getInitRowField = () => {
  const initRows = [{ ...rowField }, { ...rowField }, { ...rowField }];
  return initRows.map((item) => ({ ...item, name: "name-field-" + generateId(), }))
}

export const getSingleRow = () => {
  const row = { ...rowField }
  row.name = rowField.name + `-${generateId()}`
  return row;
}

export const getInitRowQuerySchema = () => {
  const initRows = [{ ...rowQuerySchema }];
  return initRows.map((item) => ({ ...item, name: "name-query-" + generateId(), }))
}

export const getSingleRowQuerySchema = () => {
  const row = { ...rowQuerySchema }
  row.name = rowQuerySchema.name + `-${generateId()}`
  return row;
}

export const rowField = {
  name: "name-field",
  label: "label-field",
  fieldType: "input",
  placeholder: "",
  defaultValue: "",
  step: "",
  require: false,
  disabled: false,
  twoColumn: false,
  extraMargin: false,
  columnWidth: "",
  cellEllipsis: false,
  columnHide: false,
  disabledSorting: false,
  disableFilter: false,
};

export const rowQuerySchema = {
  name: "name-query",
  label: "label-query",
  fieldType: "input",
  placeholder: "",
}

export const disabledDefaultList = [
  "barcode",
  "cascader",
  "cascader_async",
  "cascader_address",
  "checkbox",
  "upload",
  "dropdown",
  "date",
  "array",
  "object",
];

export const fieldOptions = ["require", "disabled", "twoColumn", "extraMargin"];

export const columnOptions = [
  "cellEllipsis",
  "columnHide",
  "disabledSorting",
  "disableFilter",
];

export const filedTypes = [
  "input",
  "url",
  "tel",
  "email",
  "checkbox",
  "number",
  "date",
  "cascader_async",
  "cascader_address",
  "dropdown",
  "barcode",
  "upload",
];

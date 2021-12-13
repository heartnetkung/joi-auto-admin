import lodash from "lodash";

const generateId = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

export const getInitRowField = () => {
  const initRows = [{ ...rowField }, { ...rowField }, { ...rowField }];
  return initRows.map((item) => {
    const id = generateId();
    return {
      ...item,
      name: "name-" + id,
      label: "label-" + id,
    };
  });
};

export const getSingleRow = (stepOptions) => {
  const row = { ...rowField };
  const id = generateId();
  row.name = rowField.name + `-${id}`;
  row.label = rowField.label + `-${id}`;
  if (lodash.get(stepOptions, "[0]")) {
    row.step = lodash.get(stepOptions, "[0].value");
  }
  return row;
};

export const getInitRowQuerySchema = () => {
  const initRows = [{ ...rowQuerySchema }];
  return initRows.map((item) => {
    const id = generateId();
    return {
      ...item,
      name: "name-" + id,
      label: "label-" + id,
    };
  });
};

export const getSingleRowQuerySchema = () => {
  const row = { ...rowQuerySchema };
  const id = generateId();
  row.name = rowQuerySchema.name + `-${id}`;
  row.label = rowQuerySchema.label + `-${id}`;
  return row;
};

export const rowField = {
  name: "name",
  label: "label",
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
  name: "name",
  label: "label",
  fieldType: "input",
  placeholder: "",
};

export const disabledDefaultList = [
  "barcode",
  //TODO "cascader",
  //TODO "cascader_async",
  //TODO "cascader_address",
  "upload",
  "dropdown",
  "array",
  "object",
];

export const placeholderDefault = {
  checkbox: "true/false",
  date: "YYYY-MM-DD",
  url: "http://www.google.com/...",
  tel: "0811111111",
  email: "abc@example.com",
  number: "0/1/2/...",
};

export const fieldOptions = ["require", "disabled", "twoColumn", "extraMargin"];

export const columnOptions = [
  "cellEllipsis",
  "columnHide",
  "disableSorting",
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
  //TODO "cascader_async",
  //TODO "cascader_address",
  "dropdown",
  "barcode",
  "upload",
];

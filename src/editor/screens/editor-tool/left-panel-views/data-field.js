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
  _fieldType: ["input"],
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
  "upload|single file",
  "upload|multiple images",
  "upload|firebase",
  "upload|google cloud storage",
  "dropdown",
];

export const placeholderDefault = {
  checkbox: "true/false",
  date: "YYYY-MM-DD",
  "format|url": "http://www.google.com/...",
  "format|tel": "0811111111",
  "format|email": "abc@example.com",
  "format|thai citizen id": "0139499973311",
  "format|thai zipcode": "10210",
  number: "0/1/2/...",
};

export const fieldOptions = ["require", "disabled", "twoColumn", "extraMargin"];

export const columnOptions = [
  "cellEllipsis",
  "columnHide",
  "disableSorting",
  "disableFilter",
];

export const fieldTree = [
  { l: "input" },
  { l: "dropdown" },
  { l: "checkbox" },
  { l: "number" },
  { l: "date" },
  { l: "barcode" },
  { l: "text area" },
  {
    l: "upload",
    c: [
      { l: "single file" },
      { l: "multiple images" },
      { l: "firebase" },
      { l: "google cloud storage" },
    ],
  },
  {
    l: "format",
    c: [
      { l: "url" },
      { l: "tel" },
      { l: "email" },
      { l: "thai citizen id" },
      { l: "thai zipcode" },
    ],
  },
];

export const queryFieldTree = [
  "input",
  "dropdown",
  "number",
  "checkbox",
  "date",
];

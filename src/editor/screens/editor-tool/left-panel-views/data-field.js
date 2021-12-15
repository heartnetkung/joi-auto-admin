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
  "advanced|barcode scanner",
  "upload|single file",
  "upload|multiple images",
  "upload|firebase",
  "upload|google cloud storage",
  "dropdown",
  "advanced|dependent input example",
  "common|password"
];

export const placeholderDefault = {
  checkbox: "true/false",
  date: "YYYY-MM-DD",
  "format|url": "http://www.google.com/...",
  "format|thai tel": "0811111111",
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
  { l: "common", c: [{ l: "text area" }, { l: "password" }] },
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
      { l: "email" },
      { l: "thai tel" },
      { l: "thai citizen id" },
      { l: "thai zipcode" },
      { l: "regex validation example" },
      { l: "custom validation example" },
    ],
  },
  {
    l: "advanced",
    c: [{ l: "barcode scanner" }, { l: "dependent input example" }],
  },
];

export const queryFieldTree = [
  "input",
  "dropdown",
  "number",
  "checkbox",
  "date",
];

import _ from "lodash";

const generateId = () => {
  return Math.floor(Math.random() * 90000) + 10000 + "";
};

export const getInitRowField = () => {
  const initRows = [{ ...rowField }, { ...rowField }, { ...rowField }];
  return initRows.map((item) => {
    const _id = generateId();
    return { ...item, _id, name: `name-${_id}` };
  });
};

export const getSingleRow = (stepOptions) => {
  const _id = generateId();
  const row = { ...rowField, _id, name: `name-${_id}` };
  if (_.get(stepOptions, "[0]")) row.step = _.get(stepOptions, "[0].value");
  return row;
};

export const getInitRowQuerySchema = () => {
  const initRows = [{ ...rowQuerySchema }];
  return initRows.map((item) => {
    const _id = generateId();
    return { ...item, _id, name: `name-${_id}` };
  });
};

export const getSingleRowQuerySchema = () => {
  const _id = generateId();
  return { ...rowQuerySchema, _id, name: `name-${_id}` };
};

export const rowField = {
  name: "name",
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
  columnHide: false,
  disabledSorting: false,
  disableFilter: false,
};

export const rowQuerySchema = {
  name: "name",
  fieldType: "input",
  placeholder: "",
};

export const disabledDefaultSet = new Set([
  "common|barcode scanner hardware",
  "upload|single file",
  "upload|multiple images",
  "upload|firebase",
  "upload|google cloud storage",
  "dropdown",
  "custom component|dependent input example",
  "custom component|async searchable dropdown",
  "common|password",
  "hierarchical dropdown|static option, allow modify",
  "hierarchical dropdown|static option, no modify",
  "hierarchical dropdown|async option",
]);

export const disabledPlaceholderSet = new Set([
  "checkbox",
  "upload|single file",
  "upload|multiple images",
  "upload|firebase",
  "upload|google cloud storage",
  "custom component|array of fields example",
  "custom component|color picker",
]);

export const placeholderDefault = {
  checkbox: "true/false",
  "date|date": "2021-12-30",
  "date|date-time": "2021-12-30 20:50",
  "date|time": "20:50",
  "date|month": "2021-12",
  "format|url": "http://www.google.com/...",
  "format|thai tel": "0811111111",
  "format|email": "abc@example.com",
  "format|thai citizen id": "0139499973311",
  "format|thai zipcode": "10210",
  "common|number": "0/1/2/...",
  "custom component|array of fields example": "[{}, {}]",
  "custom component|color picker": "#ff0000",
};

export const fieldOptions = [
  "require",
  "disabled",
  "twoColumn",
  "extraMargin",
  "appendDivider",
];

export const columnOptions = ["columnHide", "disableSorting", "disableFilter"];

export const fieldTree = [
  { l: "input" },
  { l: "dropdown" },
  { l: "checkbox" },
  {
    l: "common",
    c: [
      { l: "number" },
      { l: "paragraph" },
      { l: "password" },
      { l: "barcode scanner hardware" },
    ],
  },
  {
    l: "date",
    c: [{ l: "date" }, { l: "time" }, { l: "date-time" }, { l: "month" }],
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
    l: "upload",
    c: [
      { l: "single file" },
      { l: "multiple images" },
      { l: "firebase" },
      { l: "google cloud storage" },
    ],
  },
  {
    l: "hierarchical dropdown",
    c: [
      { l: "static option, allow modify" },
      { l: "static option, no modify" },
      { l: "async option" },
      { l: "thai province" },
    ],
  },
  {
    l: "custom component",
    c: [
      { l: "async searchable dropdown" },
      { l: "color picker" },
      { l: "dependent input example" },
      { l: "array of fields example" },
    ],
  },
];

export const queryFieldTree = [
  { label: "input", value: "input" },
  { label: "dropdown", value: "dropdown" },
  { label: "number", value: "common|number" },
  { label: "date", value: "date|date" },
];

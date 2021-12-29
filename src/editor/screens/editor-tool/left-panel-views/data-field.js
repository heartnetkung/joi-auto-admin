import lodash from "lodash";

const generateId = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

export const getInitRowField = () => {
  const initRows = [{ ...rowField }, { ...rowField }, { ...rowField }];
  return initRows.map((item) => {
    const _id = generateId();
    return {
      ...item,
      _id: `not-found-${_id}`,
      name: `name-${_id}`,
      label: `label-${_id}`,
    };
  });
};

export const getSingleRow = (stepOptions) => {
  const _id = generateId();
  const row = {
    ...rowField,
    _id: `not-found-${_id}`,
    name: `name-${_id}`,
    label: `label-${_id}`,
  };
  if (lodash.get(stepOptions, "[0]"))
    row.step = lodash.get(stepOptions, "[0].value");
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
  "common|barcode scanner",
  "upload|single file",
  "upload|multiple images",
  "upload|firebase",
  "upload|google cloud storage",
  "dropdown",
  "custom component|dependent input example",
  "custom component|async searchable dropdown",
  "common|password",
];

export const placeholderDefault = {
  checkbox: "true/false",
  "common|date": "YYYY-MM-DD",
  "format|url": "http://www.google.com/...",
  "format|thai tel": "0811111111",
  "format|email": "abc@example.com",
  "format|thai citizen id": "0139499973311",
  "format|thai zipcode": "10210",
  "common|number": "0/1/2/...",
};

export const fieldOptions = [
  "require",
  "disabled",
  "twoColumn",
  "extraMargin",
  "appendDivider",
];

export const columnOptions = [
  "columnHide",
  "disableSorting",
  "disableFilter",
];

export const fieldTree = [
  { l: "input" },
  { l: "dropdown" },
  { l: "checkbox" },
  {
    l: "common",
    c: [
      { l: "number" },
      { l: "date" },
      { l: "paragraph" },
      { l: "password" },
      { l: "barcode scanner" },
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
    c: [{ l: "async searchable dropdown" }, { l: "dependent input example" }],
  },
];

export const queryFieldTree = [
  "input",
  "dropdown",
  "number",
  "checkbox",
  "date",
];

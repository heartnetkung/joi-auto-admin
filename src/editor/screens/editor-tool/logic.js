import _ from "lodash";
import { validateEditor } from "../../logic";

const OMIT_SETTING = ["step"];

const findStep = (steps, target) => {
  const stepValue = steps.findIndex((item) => item.value === target);
  if (stepValue < 0) {
    return 0;
  }
  return stepValue;
};

const cleanDefault = (row) => {
  if (!row) {
    return row;
  }
  for (const [key, value] of Object.entries(row)) {
    if (value || value === 0) {
      row[key] = value;
    } else {
      delete row[key];
    }
  }
  return row;
};

const cleanColWidth = (colWidth) => {
  try {
    return parseInt(colWidth, 10);
  } catch (error) {
    return "";
  }
};

export const cleanTableSettingBeforeTrans = (setting) => {
  if (!setting) {
    return setting;
  }
  const newSetting = { ...setting };
  const omitSetting = [...OMIT_SETTING];
  if (_.get(newSetting.steps, "[0]")) {
    newSetting.steps = newSetting.steps
      .map((item, index) => item.value || `label step ${index + 1}`)
      .join(",");
  }
  if (!newSetting.steps || !_.get(newSetting.steps, "[0]")) {
    omitSetting.push("steps");
  }
  if (!newSetting.querySchema?.query) {
    omitSetting.push("querySchema");
  }
  if (newSetting.querySchema?.query) {
    const schema = [...newSetting.querySchema.schema];
    newSetting.querySchema = schema;
  }
  return _.omit(newSetting, omitSetting);
};

export const cleanFormBeforeTrans = (editor, settingSteps) => {
  if (!Array.isArray(editor) || !Array.isArray(settingSteps)) {
    return editor;
  }
  const schema = editor.map((item, index) => {
    let row = { ...item };
    row.step = findStep(settingSteps, item.step);
    if (!item.name) {
      row.name = `name-${index}`;
    }
    if (item.columnWidth) {
      row.columnWidth = cleanColWidth(item.columnWidth);
    }
    return cleanDefault(row);
  });
  return schema;
};

export const validateSchema = (editor) => {
  const validateSchema = validateEditor(editor);
  const error = _.get(validateSchema, "error.details");
  if (!_.get(error, "[0].message")) {
    return [true, ""];
  }
  const message = error.map((item) => {
    return `- ${item.message}\n`;
  });
  return [false, message.join(" ")];
};

export const handleCfLines = (editors, settings) => {
  if (!settings?.cfLine?.length) return editors;
  var ans = _.cloneDeep(editors);
  var editorKey = _.keyBy(ans, "_id");
  for (var line of settings.cfLine) {
    var field = editorKey[line.field];
    var dropdown = editorKey[line.dropdown];
    if (field && dropdown) field.conditional = [dropdown.name, line.equal];
  }
  return ans;
};

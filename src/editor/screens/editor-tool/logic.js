import _ from 'lodash';

const OMIT_SETTING = ['step', 'querySchema'];

export const cleanTableSettingBeforeTrans = (setting) => {
  if (!setting) {
    return setting;
  }
  const newSetting = { ...setting }
  const omitSetting = [...OMIT_SETTING];
  if (_.get(newSetting.steps, '[0]')) {
    newSetting.steps = newSetting.steps.map((item, index) => item.value || `label step ${index + 1}`).join(',')
  }
  if (!newSetting.steps || !_.get(newSetting.steps, '[0]')) {
    omitSetting.push('steps')
  }
  return _.omit(newSetting, omitSetting);
}

const findStep = (steps, target) => {
  const stepValue = steps.findIndex(item => item.value === target);
  if (stepValue < 0) {
    return 0;
  }
  return stepValue;
}

const cleanDefault = (row) => {
  if (!row) {
    return row;
  }
  for (const [key, value] of Object.entries(row)) {
    if (value || value === 0) {
      row[key] = value
    } else {
      delete row[key]
    }
  }
  return row
}

const cleanColWidth = (colWidth) => {
  try {
    return parseInt(colWidth, 10)
  } catch (error) {
    return ""
  }
}

export const cleanFormBeforeTrans = (editor, settingSteps) => {
  if (!Array.isArray(editor) || !Array.isArray(settingSteps)) {
    return editor;
  }
  const schema = editor.map((item, index) => {
    let row = { ...item };
    row.step = findStep(settingSteps, item.step);
    if (!item.label) {
      row.label = `label_${index}`
    }
    if (!item.name) {
      row.name = `name_${index}`
    }
    if (item.columnWidth) {
      row.columnWidth = cleanColWidth(item.columnWidth);
    }
    return cleanDefault(row);
  })
  return schema;
}
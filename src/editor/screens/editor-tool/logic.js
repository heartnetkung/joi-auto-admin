import _ from 'lodash';

const OMIT_SETTING = ['step', 'querySchema'];

export const cleanTableSettingBeforeTrans = (setting) => {
  if (!setting) {
    return setting;
  }
  const newSetting = { ...setting }
  if (_.get(newSetting.steps, '[0].value')) {
    newSetting.steps = newSetting.steps.map(item => item.value).join(',')
  }
  if (!_.get(newSetting.steps, '[0].value')) {
    OMIT_SETTING.push('steps')
  }
  return _.omit(newSetting, OMIT_SETTING);
}

const findStep = (steps, target) => {
  const stepValue = steps.findIndex(item => item.value === target);
  if (stepValue < 0) {
    return 0;
  }
  return stepValue;
}

export const cleanFormBeforeTrans = (editor, settingSteps) => {
  if (!Array.isArray(editor) || !Array.isArray(settingSteps)) {
    return editor;
  }
  const schema = editor.map((item, index) => {
    const row = { ...item };
    row.step = findStep(settingSteps, item.step);
    if (!item.label) {
      row.label = `label_${index}`
    }
    if (!item.name) {
      row.name = `name_${index}`
    }
    return row;
  })
  return schema;
}
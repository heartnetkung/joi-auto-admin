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
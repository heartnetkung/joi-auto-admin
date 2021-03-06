import _ from "lodash";
import { lookupLabel } from "../../../logic/lookup_label";

export const createOptions = (options) => {
  if (!Array.isArray(options)) {
    return [];
  }
  return options.map((item) => ({ label: item, value: item }));
};

export const createConfig = (index, options, newForm, dataOptions) => {
  if (!_.get(options, "[0]")) {
    const defaultConfig = {};
    dataOptions.forEach((item) => {
      defaultConfig[item] = false;
    });
    newForm[index] = {
      ...(newForm[index] && newForm[index]),
      ...defaultConfig,
    };
    return newForm;
  }
  const keyDiffOptions = _.keyBy(_.difference(dataOptions, options));
  dataOptions.forEach((item) => {
    if (keyDiffOptions[item]) {
      newForm[index][item] = false;
    } else {
      newForm[index][item] = true;
    }
  });
  return newForm;
};

export const createStepOptions = () => {
  const options = [{ label: "No step", value: "No step" }];
  for (let i = 2; i <= 20; i++) {
    options.push({ label: i + " step", value: i });
  }
  return options;
};

export const getDefaultBooleanConfig = (options) => {
  if (!Array.isArray(options)) {
    return options;
  }
  return options.find((item) => item.label === "extraMargin");
};

export const getHeader = (item) => {
  var name = lookupLabel(item);
  if (!item.step && item.step !== 0) return name;
  return `${name} (${item.step})`;
};

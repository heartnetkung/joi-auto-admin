import Joi from "joi/lib/index";

const getJoiType = (fieldType) => {
  switch (fieldType) {
    case "string":
    case "inputPhone":
    case "inputEmail":
    case "inputUrl":
      return Joi.string();
    case "date":
      return Joi.date();
    case "number":
      return Joi.number().integer();
    case "dropdown":
      return Joi.string().valid("m", "f").default("m");
    default:
      return Joi.string();
  }
};

const getJoiMeta = (item, fieldType) => {
  if (!item) {
    return {};
  }
  const ans = {
    placeholder: item.placeholder || "",
    disabled: item.disabled || false,
    twoColumn: item.twoColumn || false,
    extraMargin: item.extraMargin || false,
    cellEllipsis: item.cellEllipsis || false,
    columnHide: item.columnHide || false,
    disabledSorting: item.disabledSorting || false,
    disableFilter: item.disableFilter || false,
  };
  if (fieldType === "dropdown") {
    ans.validLabel = ["ชาย", "หญิง"];
  }
  return ans;
};

export const joiParser = (data) => {
  if (!Array.isArray(data)) {
    return null;
  }
  const schema = {};
  data.forEach((item) => {
    const JoiConfig = getJoiType(item.fieldType);
    JoiConfig.label(item.label || "label");
    JoiConfig.meta({ ...getJoiMeta() });
    if (item.require) {
      JoiConfig.required();
    }
    schema[item.name] = JoiConfig;
  });
  return schema;
};

export const tableParser = (config) => {
  if (!config) {
    return {};
  }
  const tableConfigs = {};
  tableConfigs.name = config.name || "empty-table-name";
  tableConfigs.description = config.description || "description";
  tableConfigs.getMany = async (query) => {
    return [];
  };
  tableConfigs.onSubmit = async (formData) => {};
  if (config.canCreate) {
    tableConfigs.createMay = async (rowArray) => {
      return rowArray.map((a) => ({ ...a, _id: Math.random() }));
    };
  }
  if (config.canUpdate) {
    tableConfigs.updateOne = async (rowObj) => {};
  }
  if (config.canDelete) {
    tableConfigs.deleteMany = async (rowArray) => {};
  }
  tableConfigs.canDownloadExcel = config.canDownloadExcel || false;
  tableConfigs.canUploadExcel = config.canUploadExcel || false;

  return tableConfigs;
};

import Joi from "joi/lib/index";
import { getErrorMessage } from "./error_message";
import _ from "lodash";
import numeral from "numeral";
import moment from "moment";

const OMIT_META = [
	"twoColumn",
	"defaultValue",
	"fieldType",
	"validLabel",
	"cellTextFormat",
	"cellWidth",
	"cellEllipsis",
	"cellHide",
	"fieldHide",
	"containerStyle",
];

class JoiWrapper {
	constructor(joiObj) {
		if (Joi.isSchema(joiObj)) {
			this.joiObj = joiObj;
			this.describe = joiObj.describe();
		} else {
			try {
				this.joiObj = Joi.build(joiObj);
				this.describe = joiObj;
			} catch (e) {
				throw new Error("Invalid Joi Object");
			}
		}
		this.joiObj = this.joiObj.append({ _id: Joi.any() });
		this.formSpec = [];
		traverse(this.describe, [], this.formSpec, this.joiObj);
		handleCellShow(this.formSpec);
		this.columns = this.formSpec.map((a) => a.column);
		this.toDefaultValues = this.toDefaultValues.bind(this);
	}

	toDefaultValues() {
		if (!this.defaultValues) {
			var ans = (this.defaultValues = {});
			for (var { name, defaultValue } of this.formSpec) {
				if (typeof defaultValue === "function")
					defaultValue = defaultValue();
				if (defaultValue !== undefined) _.set(ans, name, defaultValue);
			}
		}
		return this.defaultValues;
	}
}

const traverse = (node, path, ans, joiObj) => {
	if (node?.flags?.label) ans.push(new JoiField(node, path, joiObj));

	var keys = node.keys;
	if (keys)
		for (var key in keys) traverse(keys[key], [...path, key], ans, joiObj);
};

const handleCellShow = (formSpec) => {
	var hasCellShow = false;
	for (var item of formSpec)
		if (item.meta.cellShow) {
			hasCellShow = true;
			break;
		}

	if (hasCellShow)
		for (var spec of formSpec)
			if (spec.meta.cellShow) delete spec.meta.cellShow;
			else spec.column.cellHide = true;
};

class JoiField {
	constructor(field, path, joiObj) {
		var meta = this.getMeta(field);

		this.required = field?.flags?.presence === "required";
		this.label = field?.flags?.label;
		this.name = path.join(".");
		this.fieldType = this.guessFieldType(field, meta);
		this._extractedSchema = joiObj.extract(path);
		this.validate = this.validate.bind(this);
		this.type = field.type;
		this.twoColumn = !!meta.twoColumn;
		this.defaultValue = field?.flags?.default;
		this.column = this.getColumn(meta, this);
		this.fieldHide = meta.fieldHide;
		this.meta = _.omit(meta, OMIT_META);
		this.containerStyle = meta.containerStyle;
	}

	getColumn(meta, $this) {
		var { fieldType, type, label, name } = $this;
		var ans = {
			ellipsis: meta.cellEllipsis,
			render: meta.cellTextFormat,
			width: meta.cellWidth,
			cellHide: meta.cellHide,
			title: label,
			dataIndex: name.split("."),
			key: name,
			type,
			fieldType,
		};

		if (!ans.width) {
			if (type === "number") ans.width = 80;
			else if (type === "date") ans.width = 130;
		}

		if (!ans.render) {
			if (type === "number") ans.render = (a) => numeral(a).format("0,0");
			else if (type === "boolean")
				ans.render = (a) => (a ? "ใช่" : "ไม่ใช่");
			else if (type === "date")
				ans.render = (a) => moment(a).format("YYYY-MM-DD");
			else if (type === "array") ans.render = (a) => a.join(", ");
			else if (fieldType === "Select") ans.render = (a) => meta.valid[a];
		}

		return ans;
	}

	getMeta(field) {
		var metas = field?.metas;
		var ans = {};
		if (Array.isArray(metas) && metas.length === 1) ans = { ...metas[0] };

		if (field?.flags?.only && field?.allow) {
			var { validLabel } = ans;
			var allow = field?.allow;
			if (!Array.isArray(validLabel)) validLabel = allow;
			else if (validLabel?.length !== field?.allow?.length)
				throw new Error(
					"validLabel is required and must have the equal length"
				);
			var valid = (ans.valid = {});
			for (var i = 0, ii = allow.length; i < ii; i++)
				valid[allow[i]] = validLabel[i];
		}

		return ans;
	}

	guessFieldType(field, meta) {
		if (meta.fieldType) return meta.fieldType;
		if (field.type === "boolean") return "Checkbox";
		if (field.type === "date") return "DatePicker";
		if (field.type === "number") return "InputNumber";
		if (meta.valid) return "Select";
		if (meta.loadBarcodeName) return "Barcode";
		return "Input";
	}

	validate(value) {
		var rawError = this._extractedSchema.validate(value);
		if (!rawError.error || !Array.isArray(rawError.error.details))
			return null;

		for (var errorObj of rawError.error.details)
			return getErrorMessage(errorObj, this.label);

		return null;
	}
}

export { JoiField, JoiWrapper };

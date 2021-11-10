import Joi from "joi/lib/index";
import { getErrorMessage } from "./error_message";
import _ from "lodash";

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
		this.toColumns = this.toColumns.bind(this);
		this.toDefaultValues = this.toDefaultValues.bind(this);
	}

	toColumns() {
		if (!this.columns) {
			this.columns = this.formSpec.map((a) => ({
				title: a.label,
				dataIndex: a.name.split("."),
				key: a.name,
				type: a.type,
				fieldType: a.fieldType,
				disabled: a.meta.disabled,
				valid: a.meta.valid,
				tableHide: a.meta.tableHide,
			}));
		}
		return this.columns;
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

class JoiField {
	constructor(field, path, joiObj) {
		this.required = field?.flags?.presence === "required";
		this.label = field?.flags?.label;
		this.name = path.join(".");
		this.meta = this.getMeta(field);
		this.fieldType = this.guessFieldType(field, this.meta);
		this._extractedSchema = joiObj.extract(path);
		this.validate = this.validate.bind(this);
		this.type = field.type;
		this.twoColumn = !!this.meta.twoColumn;
		this.defaultValue = field?.flags?.default;

		delete this.meta.twoColumn;
		delete this.meta.fieldType;
		delete this.meta.validLabel;
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

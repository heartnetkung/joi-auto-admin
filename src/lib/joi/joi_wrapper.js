import Joi from "joi/lib/index";
import { getErrorMessage } from "./error_message";
import _ from "lodash";
import numeral from "numeral";
import moment from "moment";
import { prepare } from "./prepare_joi";
import React from "react";
import ColImage from "../formik/components/col_image";
import memo from "memoizee";

const OMIT_META = [
	"twoColumn",
	"defaultValue",
	"fieldType",
	"validLabel",
	"cellFormat",
	"cellWidth",
	"cellEllipsis",
	"cellHide",
	"fieldHide",
	"containerStyle",
	"step",
	"disableSorting",
	"disableFilter",
	"onFieldRender",
	"appendDivider",
];

const MEMO_OPTION = { promise: true, primitive: true };

class JoiWrapper {
	constructor(joiObj, devMode) {
		if (!Joi.isSchema(joiObj)) throw new Error("Invalid Joi Object");

		this.describe = joiObj.describe();
		this.joiObj = prepare(joiObj, this.describe, devMode);
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
		this.fieldType = guessFieldType(field, meta);
		this._extractedSchema = this.getExtractedSchema(joiObj, path);
		this.validate = this.validate.bind(this);
		this.type = field.type;
		this.defaultValue = this.getDefaultValue(field, this.fieldType);
		this.column = this.getColumn(meta, this);

		//remove excess data from meta
		this.twoColumn = meta.twoColumn;
		this.fieldHide = meta.fieldHide;
		this.containerStyle = meta.containerStyle;
		this.step = meta.step;
		this.onFieldRender = meta.onFieldRender;
		this.appendDivider = meta.appendDivider;
		this.meta = _.omit(meta, OMIT_META);
	}

	getDefaultValue(field, fieldType) {
		var ans = field?.flags?.default;
		if (fieldType === "TimePicker") return moment(ans, "HH:mm");
		return ans;
	}

	getExtractedSchema(joiObj, path) {
		var { fieldType } = this;
		var ans = joiObj.extract(path);
		if (fieldType === "InputPhone")
			return ans.pattern(/^0([2]|[6]|[0-9][0-9])[0-9]{7}$/);
		if (fieldType === "InputEmail") return ans.email();
		if (fieldType === "InputURL")
			return ans.uri({ scheme: ["http", "https"] });
		return ans;
	}

	getColumn(meta, $this) {
		var { fieldType, type, label, name } = $this;
		var ans = {
			render: meta.cellFormat,
			width: meta.cellWidth,
			cellHide: meta.cellHide,
			disableSorting: meta.disableSorting,
			disableFilter: meta.disableFilter,
			title: label,
			dataIndex: name.split("."),
			key: name,
			type,
			fieldType,
		};

		if (!ans.width) {
			if (type === "number") ans.width = 80;
			else if (type === "date" && !meta.showTime) ans.width = 130;
			else if (fieldType === "FileUpload") ans.width = 150;
			else if (fieldType === "InputURL") ans.width = 250;
			else if (fieldType === "TextArea") ans.width = 250;
		}

		if (!ans.render) {
			if (fieldType === "Select") ans.render = (a) => meta.valid[a];
			else if (fieldType === "InputPhone")
				ans.render = (a) => {
					if (typeof a !== "string") return null;
					return a.replace(
						/(\d{2,3})(\d{3})(\d{4})/,
						(m, p1, p2, p3) => [p1, p2, p3].join("-")
					);
				};
			else if (fieldType === "TextArea")
				ans.render = (a) => {
					if (typeof a !== "string") return null;
					return (
						<div
							style={{
								maxWidth: 250,
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
							}}
							title={a + ""}
						>
							{a}
						</div>
					);
				};
			else if (
				fieldType === "InputURL" ||
				(fieldType === "FileUpload" && meta.uploadFileType !== "image")
			) {
				ans.render = (a) => {
					if (typeof a !== "string") return null;
					return (
						<a
							style={{
								maxWidth: 200,
								display: "block",
								overflow: "hidden",
								whiteSpace: "nowrap",
								textOverflow: "ellipsis",
							}}
							title={a + ""}
							href={a}
							target="_blank"
							rel="noreferrer"
						>
							{a}
						</a>
					);
				};
			} else if (
				fieldType === "FileUpload" &&
				meta.uploadFileType === "image"
			)
				ans.render = (a) => <ColImage src={a} />;
			else if (fieldType === "CascaderAsync")
				ans.render = (a) => (Array.isArray(a) ? a.join(" / ") : null);
			else if (fieldType === "FieldArray")
				ans.render = (a) =>
					Array.isArray(a) ? `${a.length} ??????????????????` : null;
			else if (type === "number")
				ans.render = (a) =>
					typeof a === "number" ? numeral(a).format("0,0") : null;
			else if (type === "boolean")
				ans.render = (a) =>
					typeof a !== "boolean" ? null : a ? "?????????" : "??????????????????";
			else if (type === "date") {
				var format = meta.showTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD";
				if (fieldType === "TimePicker") format = "HH:mm";
				if (fieldType === "MonthPicker") format = "YYYY-MM";
				ans.render = (a) =>
					a instanceof Date ? moment(a).format(format) : null;
			} else if (type === "array")
				ans.render = (a) => (Array.isArray(a) ? a.join(", ") : null);
			else
				ans.render = (a) => {
					if (a == null) return null;
					var ans = a + "";
					if (ans === "[object Object]") return null;
					return ans;
				};
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

		if (ans.loadBarcodeName)
			ans.loadBarcodeName = memo(ans.loadBarcodeName, MEMO_OPTION);
		if (ans.cascaderFetchData)
			ans.cascaderFetchData = memo(ans.cascaderFetchData, MEMO_OPTION);

		return ans;
	}

	validate(value) {
		var rawError = this._extractedSchema.validate(value);
		if (this.required && !value)
			return getErrorMessage(
				{ type: "any.required", message: "" },
				this.label
			);

		if (!rawError.error || !Array.isArray(rawError.error.details))
			return null;

		for (var errorObj of rawError.error.details)
			return getErrorMessage(errorObj, this.label);

		return null;
	}
}

const guessFieldType = (field, meta) => {
	if (meta.fieldType) return meta.fieldType;
	if (meta.onFieldRender) return "Custom";
	if (meta.loadBarcodeName) return "Barcode";
	if (meta.getUploadUrl || meta.firebaseConfig || meta.uploadFile)
		return "FileUpload";
	if (meta.cascaderFetchData) return "CascaderAsync";
	if (meta.cascaderOptions) return "CascaderStatic";
	if (field.type === "boolean") return "Checkbox";
	if (field.type === "date") return "DatePicker";
	if (field.type === "number") return "InputNumber";
	if (meta.valid) return "Select";
	return "Input";
};

export { guessFieldType, JoiWrapper };

const errorTranslation = {
	"any.required": "จำเป็นต้องกรอก",
	"string.empty": "จำเป็นต้องกรอก",
	"string.uri": "URL ไม่ถูกต้อง",
	"string.min": (errorObj) =>
		`ต้องกรอกไม่ต่ำกว่า ${errorObj.context.limit} ตัวอักษร`,
	"string.max": (errorObj) =>
		`ต้องกรอกไม่เกิน ${errorObj.context.limit} ตัวอักษร`,
	"string.email": "อีเมลไม่ถูกต้อง",
	"number.base": "ต้องเป็นตัวเลข",
};

export const getErrorMessage = (errorObj, label) => {
	label = label || errorObj?.context?.label;

	var { message, type, context } = errorObj;
	if (type === "any.custom") return context?.error?.message;
	if (/[ก-ฮ]/.test(message.replace(/"[^"]+"/g, ""))) return message;
	if (/pattern/.test(type) && label) return `${label}ไม่ถูกต้อง`;

	var found = errorTranslation[type];
	if (!found && label) return `${label}ไม่ถูกต้อง (${message})`;
	if (!found) return `ค่าไม่ถูกต้อง (${message})`;

	if (typeof found === "string") return found;
	return found(errorObj);
};

const errorTranslation = {
	"any.required": "จำเป็นต้องกรอก",
	"string.empty": "จำเป็นต้องกรอก",
	"string.uri": "URL ไม่ถูกต้อง",
	"string.min": (errorObj) =>
		`ต้องกรอกไม่ต่ำกว่า ${errorObj.context.limit} ตัวอักษร`,
	"string.max": (errorObj) =>
		`ต้องกรอกไม่เกิน ${errorObj.context.limit} ตัวอักษร`,
	"string.email": "อีเมลไม่ถูกต้อง",
};

export const getErrorMessage = (errorObj, label) => {
	var { message, type } = errorObj;
	if (/[ก-ฮ]/.test(message.replace(/"[^"]+"/g, ""))) return message;
	if (/pattern/.test(type)) return `${label}ไม่ถูกต้อง`;

	var found = errorTranslation[type];
	if (!found) return `${label}ไม่ถูกต้อง (${message})`;

	if (typeof found === "string") return found;
	return found(errorObj);
};

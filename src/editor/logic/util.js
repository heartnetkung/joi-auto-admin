export const raw = (a, isObj) =>
	isObj ? a : "\u0092" + a.toString() + "\u0092";

export const regex = (a, isObj) =>
	isObj ? a : "\u0092" + a.toString().replace(/\\/g, "\u0091") + "\u0092";

export const showRaw = (a, isObj) => {
	if (isObj) return a;
	return a
		.replace(/\u0092\\*"/g, "")
		.replace(/\\*"\u0092/g, "")
		.replace(/\\+n/g, "\n")
		.replace(/\\+"/g, '"')
		.replace(/\\+'/g, "'")
		.replace(/\u0092/g, "")
		.replace(/\u0091/g, "\\");
};

export const softEval = (a, type) => {
	try {
		// eslint-disable-next-line
		var ans = Function('"use strict";return (' + a + ")")();
		return ans == null ? a : ans;
	} catch (e) {
		if (type === "array") return a.split(/\s*,\s*/);
		return a;
	}
};

// soft eval for function without dependencies
// this bad eval-based implementation is selected since Function.toString() doesn't work with Babel
export const func = (str, isObj) => {
	if (!isObj) return raw(str, isObj);
	// eslint-disable-next-line
	return Function(
		'"use strict";var wait = (ms) => new Promise((res) => setTimeout(res, ms));return (' +
			str +
			")"
	)();
};

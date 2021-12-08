export const raw = (a, isObj) =>
	isObj ? a : "\u0092" + a.toString() + "\u0092";

export const showRaw = (a, isObj) => {
	if (isObj) return a;
	return a
		.replace(/\u0092\\*"/g, "")
		.replace(/\\*"\u0092/g, "")
		.replace(/\\+n/g, "\n")
		.replace(/\\+"/g, '"')
		.replace(/\\+'/g, "'")
		.replace(/\u0092/g, "");
};
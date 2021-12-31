import Joi from "joi/lib/index";

// https://stackoverflow.com/questions/42370881/allow-string-to-be-null-or-empty-in-joi-and-express-validation
// https://github.com/sideway/joi/issues/482
export const fixEmptyString = (joiObj, describeObj) => {
	const strPaths = [];
	const traverse = (node, path) => {
		if (node?.flags?.label && node?.flags?.presence !== "required")
			if (node?.type === "string") strPaths.push(path);

		var keys = node.keys;
		if (keys) for (var key in keys) traverse(keys[key], [...path, key]);
	};

	traverse(describeObj, []);
	return joiObj.fork(strPaths, (schema) => schema.allow("", null));
};

export const handleDevMode = (joiObj, describeObj) => {
	const strPaths = [];
	const otherPaths = [];
	const traverse = (node, path) => {
		if (node?.flags?.label && node?.flags?.presence) {
			delete node.flags.presence;
			if (node?.type === "string") strPaths.push(path);
			else otherPaths.push(path);
		}

		var keys = node.keys;
		if (keys) for (var key in keys) traverse(keys[key], [...path, key]);
	};

	traverse(describeObj, []);
	return joiObj
		.fork(otherPaths, (a) => a.optional().allow(null))
		.fork(strPaths, (a) => a.optional().allow("", null));
};

export const handleFieldHide = (joiObj, describeObj) => {
	const strPaths = [];
	const otherPaths = [];
	const traverse = (node, path) => {
		if (node?.flags?.label && node?.metas?.[0]?.fieldHide) {
			if (node?.type === "string") strPaths.push(path);
			else otherPaths.push(path);
		}

		var keys = node.keys;
		if (keys) for (var key in keys) traverse(keys[key], [...path, key]);
	};

	traverse(describeObj, []);
	return joiObj
		.fork(otherPaths, (a) => a.optional().allow(null))
		.fork(strPaths, (a) => a.optional().allow("", null));
};

export const prepare = (joiObj, describeObj, devMode) => {
	if (devMode) joiObj = handleDevMode(joiObj, describeObj);
	else {
		joiObj = fixEmptyString(joiObj, describeObj);
		joiObj = handleFieldHide(joiObj, describeObj);
	}
	return joiObj.append({ _id: Joi.any() });
};

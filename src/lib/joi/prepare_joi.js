import Joi from "joi/lib/index";

// https://stackoverflow.com/questions/42370881/allow-string-to-be-null-or-empty-in-joi-and-express-validation
// https://github.com/sideway/joi/issues/482
export const fixEmptyString = (joiObj, describeObj) => {
	const traverse = (node, path, ans) => {
		if (node?.flags?.label && node?.type === "string")
			if (node?.flags?.presence !== "required") ans.push(path);

		var keys = node.keys;
		if (keys)
			for (var key in keys) traverse(keys[key], [...path, key], ans);
	};

	var paths = [];
	traverse(describeObj, [], paths);
	return joiObj.fork(paths, (schema) => schema.allow(""));
};

export const handleDevMode = (joiObj, describeObj) => {
	const traverse = (node, path) => {
		if (node?.flags?.label && node?.flags?.presence) {
			delete node.flags.presence;
			paths.push(path);
		}

		var keys = node.keys;
		if (keys) for (var key in keys) traverse(keys[key], [...path, key]);
	};

	const paths = [];
	traverse(describeObj, []);
	return joiObj.fork(paths, (a) => a.optional());
};

export const handleFieldHide = (joiObj, describeObj) => {
	const traverse = (node, path, ans) => {
		if (node?.flags?.label && node?.metas?.[0]?.fieldHide) ans.push(path);

		var keys = node.keys;
		if (keys)
			for (var key in keys) traverse(keys[key], [...path, key], ans);
	};

	var paths = [];
	traverse(describeObj, [], paths);
	return joiObj.fork(paths, (schema) => schema.optional());
};

export const prepare = (joiObj, describeObj, devMode) => {
	joiObj = fixEmptyString(joiObj, describeObj);
	if (devMode) joiObj = handleDevMode(joiObj, describeObj);
	joiObj = handleFieldHide(joiObj, describeObj);
	return joiObj.append({ _id: Joi.any() });
};

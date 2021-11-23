// https://stackoverflow.com/questions/42370881/allow-string-to-be-null-or-empty-in-joi-and-express-validation

const traverse = (node, path, ans) => {
	if (node?.flags?.label && node?.type === "string")
		if (node?.flags?.presence !== "required") ans.push(path);

	var keys = node.keys;
	if (keys) for (var key in keys) traverse(keys[key], [...path, key], ans);
};

export const fixEmptyString = (joiObj, describeObj) => {
	var paths = [];
	traverse(describeObj, [], paths);
	return joiObj.fork(paths, (schema) => schema.allow(""));
};

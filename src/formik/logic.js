export const calculateSpan = (formSpec) => {
	var ans = [];
	var isPreviousLeft = false;
	for (var i = 0, ii = formSpec.length; i < ii; i++) {
		var current = formSpec[i];
		if (!current.twoColumn) {
			ans.push(current);
			isPreviousLeft = false;
		} else if (isPreviousLeft === false) {
			//left
			var hasNext = formSpec[i + 1]?.twoColumn;
			ans.push({
				...current,
				colSpan: hasNext ? 12 : 24,
				labelCol: hasNext ? { span: 8 } : { span: 4 },
				wrapperCol: hasNext ? { span: 14 } : { span: 7 },
			});
			isPreviousLeft = true;
		} else {
			//right
			ans.push({
				...current,
				colSpan: 12,
				labelCol: { span: 4 },
				wrapperCol: { span: 16 },
			});
			isPreviousLeft = false;
		}
	}
	return ans;
};

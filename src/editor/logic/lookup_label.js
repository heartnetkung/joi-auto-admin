export const lookupLabel = (item) => {
	const { _id, label, fieldType } = item;
	if (label) return label;
	switch (fieldType) {
		case "common|paragraph":
			return `paragraph-${_id}`;
		case "format|url":
			return "url link";
		case "format|thai tel":
			return "เบอร์โทรศัพท์";
		case "format|email":
			return "อีเมล";
		case "common|password":
			return "รหัสผ่าน";
		case "format|thai zipcode":
			return "รหัสไปรษณีย์";
		case "custom component|dependent input example":
		case "format|regex validation example":
		case "format|custom validation example":
			return `example-${_id}`;
		case "format|thai citizen id":
			return "เลขบัตรปชช";
		case "checkbox":
			return `checkbox-${_id}`;
		case "common|number":
			return `number-${_id}`;
		case "common|date":
			return "วันที่";
		case "common|barcode scanner":
			return "บาร์โค้ด";
		case "hierarchical dropdown|thai province":
			return "จังหวัด/เขต/อำเภอ";
		case "hierarchical dropdown|static option, allow modify":
		case "hierarchical dropdown|static option, no modify":
		case "hierarchical dropdown|async option":
		case "custom component|async searchable dropdown":
		case "dropdown":
			return `dropdown-${_id}`;
		case "upload|multiple images":
		case "upload|firebase":
		case "upload|google cloud storage":
		case "upload|single file":
			return `upload-${_id}`;
		case "input":
			return `input-${_id}`;
		default:
			return `label-${_id}`;
	}
};

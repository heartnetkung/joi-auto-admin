const fs = require("fs");
const _ = require("lodash");
const input = require("./data");

console.stringify = (a) => console.log(JSON.stringify(a, null, 2));

const makeObjectBased = (data) => {
	var ans = {};
	for (var zipCode of data) {
		if (!zipCode.provinceList) continue;

		for (var p of zipCode.provinceList) {
			if (!ans[p.provinceId])
				ans[p.provinceId] = { l: p.provinceName, c: {} };
		}

		for (var d of zipCode.districtList) {
			if (!ans[d.proviceId].c[d.districtId])
				ans[d.proviceId].c[d.districtId] = { l: d.districtName, c: {} };
		}

		for (var s of zipCode.subDistrictList)
			if (!ans[s.provinceId].c[s.districtId].c[s.subDistrictId])
				ans[s.provinceId].c[s.districtId].c[s.subDistrictId] = {
					l: s.subDistrictName,
					c: [{ l: zipCode.zipCode }],
				};
	}
	return ans;
};

const comparator = (a, b) => {
	if (a.l === "กรุงเทพมหานคร") return -1;
	if (b.l === "กรุงเทพมหานคร") return 1;
	return a.l > b.l ? 1 : -1;
};

const mapSort = (a, b) => _.map(a, b).sort(comparator);

const makeListBased = (data) => {
	var ans = mapSort(data, (a) => {
		if (a.c)
			a.c = mapSort(a.c, (a) => {
				if (a.c) a.c = mapSort(a.c, _.identity);
				return a;
			});
		return a;
	});
	return ans;
};

const main = () => {
	var data = makeObjectBased(input);
	data = makeListBased(data);
	fs.writeFileSync(
		"out.json",
		"module.exports=" + JSON.stringify(data).replace(/"l"/g, "l").replace(/"c"/g, "c")
	);
};
main();

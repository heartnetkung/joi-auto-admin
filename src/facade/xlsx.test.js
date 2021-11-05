import * as lib from "./xlsx";

describe("xlsx", () => {
	describe("tableToExcel()", () => {
		it("empty case", () => {
			var input = [];
			var output = { "!ref": "A1" };
			var ret = lib.tableToExcel(input);
			expect(ret).toEqual(output);
		});
		it("array case", () => {
			var input = [{ a: [1, [2, 3]] }];
			var output = {
				"!ref": "A1:A2",
				A1: { t: "s", v: "a" },
				A2: { t: "s", v: "1,2,3" },
			};
			var ret = lib.tableToExcel(input);
			expect(ret).toEqual(output);
		});
		it("object case", () => {
			var input = [{ a: { b: "c" } }];
			var output = {
				"!ref": "A1:A2",
				A1: { t: "s", v: "a.b" },
				A2: { t: "s", v: "c" },
			};
			var ret = lib.tableToExcel(input);
			expect(ret).toEqual(output);
		});
	});
});

import * as lib from "./xlsx";

describe("xlsx", () => {
	describe("tableToExcel()", () => {
		it("empty case", () => {
			var input = [];
			var output = { "!ref": "A1" };
			var ret = lib.tableToExcel(input);
			expect(ret).toEqual(output);
		});
		it("basic case", () => {
			var input = [
				{
					num: 1,
					bool: true,
					bool2: false,
					str: "abc",
					undefined: undefined,
					null: null,
				},
			];
			var output = {
				"!ref": "A1:F2",
				A1: {
					t: "s",
					v: "num",
				},
				A2: {
					t: "n",
					v: 1,
				},
				B1: {
					t: "s",
					v: "bool",
				},
				B2: {
					t: "b",
					v: true,
				},
				C1: {
					t: "s",
					v: "bool2",
				},
				C2: {
					t: "b",
					v: false,
				},
				D1: {
					t: "s",
					v: "str",
				},
				D2: {
					t: "s",
					v: "abc",
				},
				E1: {
					t: "s",
					v: "undefined",
				},
				E2: {
					t: "z",
					v: undefined,
				},
				F1: {
					t: "s",
					v: "null",
				},
				F2: {
					t: "z",
					v: null,
				},
			};
			var ret = lib.tableToExcel(input);
			expect(ret).toEqual(output);
		});
		it("array case", () => {
			try {
				var input = [{ a: [1, [2, 3]] }];
				lib.tableToExcel(input);
				expect(true).toBe(false);
			} catch (e) {
				expect(e.message).toBe("XLSX layer does not support array");
			}
		});
		it("object case", () => {
			try {
				var input = [{ a: { b: "c" } }];
				lib.tableToExcel(input);
				expect(true).toBe(false);
			} catch (e) {
				expect(e.message).toBe("XLSX layer does not support object");
			}
		});
	});

	describe("parseExcelDate()", () => {
		it("normal case", () => {
			var input = 44506.42558618056;
			var output = new Date("2021-11-06T03:12:50.000Z");
			var ret = lib.parseExcelDate(input);
			expect(ret).toEqual(output);
		});
	});
});

import * as lib from "./serialize";
import Joi from "joi/lib/index";
import { JoiWrapper } from "./joi_wrapper";

const schema = Joi.object({
	name: Joi.string()
		.min(3)
		.max(30)
		.required()
		.label("ชื่อ")
		.meta({ placeholder: "ชื่อภาษาไทย" }),
	purchased_value: Joi.number().integer().label("เงิน"),
	district: Joi.array().label("เขต").meta({ fieldType: "AddressDistrict" }),
	create_date: Joi.date()
		.default(Date.now)
		.label("วันสมัคร")
		.meta({ disabled: true }),
});

describe("serialize", () => {
	describe("serializeTable()", () => {
		it("empty case", () => {
			var input = [];
			var output = [];
			var ret = lib.serializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});

		it("basic case", () => {
			var input = [
				{
					name: "abc",
					purchased_value: 1,
					district: ["a", "b"],
					create_date: new Date("2000-01-02"),
				},
			];
			var output = [
				{
					ชื่อ: "abc",
					เงิน: 1,
					เขต: "a,b",
					วันสมัคร: "2000-01-02",
				},
			];
			var ret = lib.serializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});
	});

	describe("deserializeTable()", () => {
		it("empty case", () => {
			var input = [];
			var output = [];
			var ret = lib.deserializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});

		it("basic case", () => {
			var input = [
				{
					ชื่อ: "abc",
					เงิน: 1,
					เขต: "a,b",
					วันสมัคร: "2000-01-02",
				},
			];
			var output = [
				{
					name: "abc",
					purchased_value: 1,
					district: ["a", "b"],
					create_date: new Date("2000-01-02"),
				},
			];
			var ret = lib.deserializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});

		it("error case", () => {
			var input = [
				{
					ชื่อ: "a",
					เงิน: "a",
					เขต: "a,b",
					วันสมัคร: "2000-01-02",
				},
			];
			try {
				lib.deserializeTable(input, new JoiWrapper(schema));
				expect(true).toBe(false);
			} catch (e) {
				expect(e.name).toBe("SerializeError");
				expect(e.errors.length).toBe(2);
				expect(e.errors[0]).toEqual({
					label: "ชื่อ",
					line: 1,
					message: "ต้องกรอกไม่ต่ำกว่า 3 ตัวอักษร",
					type: "string.min",
				});
				expect(e.errors[1]).toEqual({
					label: "เงิน",
					line: 1,
					message: "ต้องเป็นตัวเลข",
					type: "number.base",
				});
			}
		});
	});
});

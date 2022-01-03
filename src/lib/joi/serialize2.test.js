import * as lib from "./serialize2";
import Joi from "joi/lib/index";
import { JoiWrapper } from "./joi_wrapper";

const schema = Joi.object({
	name: Joi.object({
		first: Joi.string()
			.min(3)
			.max(30)
			.required()
			.label("ชื่อ")
			.meta({ placeholder: "ชื่อภาษาไทย" }),
	}),
	purchased_value: Joi.number().integer().label("เงิน"),
	barcode: Joi.array().items(Joi.string()).label("บาร์โค้ด"),
	create_date: Joi.date()
		.default(Date.now)
		.label("วันสมัคร")
		.meta({ disabled: true }),
	dateTime: Joi.date().label("dateTime").meta({ showTime: true }),
	time: Joi.date().label("time").meta({ fieldType: "TimePicker" }),
	month: Joi.date().label("month").meta({ fieldType: "MonthPicker" }),
	foo: Joi.any().label("foo"),
	bar: Joi.string().label("bar").meta({ fieldHide: true }),
	$baz: Joi.string().label("baz"),
	array: Joi.array()
		.items(
			Joi.object({
				a1: Joi.string().label("_a1"),
				a2: Joi.number().label("_a2"),
			})
		)
		.label("_array")
		.meta({ fieldType: "FieldArray" }),
});

describe("serialize", () => {
	describe("serializeTable()", () => {
		it("empty case", () => {
			var input = [];
			var output = [
				{
					"name.first": "ชื่อ",
					purchased_value: "เงิน",
					"barcode[0]": "บาร์โค้ด[1]",
					create_date: "วันสมัคร",
					dateTime: "dateTime",
					time: "time",
					month: "month",
					"array[0].a1": "_array _a1[1]",
					"array[0].a2": "_array _a2[1]",
				},
			];
			var ret = lib.serializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});

		it("basic case", () => {
			var input = [
				{
					name: { first: "abc" },
					purchased_value: 1,
					barcode: ["a", "b"],
					create_date: new Date("2000-01-02"),
					dateTime: new Date("2000-01-02 00:00"),
					time: new Date("2000-01-02 17:05"),
					month: new Date("2000-01-02"),
					array: [
						{ a1: "a11", a2: 21 },
						{ a1: "a12", a2: 22 },
					],
				},
			];
			var output = [
				{
					"name.first": "ชื่อ",
					purchased_value: "เงิน",
					"barcode[0]": "บาร์โค้ด[1]",
					"barcode[1]": "บาร์โค้ด[2]",
					create_date: "วันสมัคร",
					dateTime: "dateTime",
					time: "time",
					month: "month",
					"array[0].a1": "_array _a1[1]",
					"array[0].a2": "_array _a2[1]",
					"array[1].a1": "_array _a1[2]",
					"array[1].a2": "_array _a2[2]",
				},
				{
					"name.first": "abc",
					purchased_value: 1,
					"barcode[0]": "a",
					"barcode[1]": "b",
					create_date: "2000-01-02",
					dateTime: "2000-01-02 00:00",
					time: "17:05",
					month: "2000-01",
					"array[0].a1": "a11",
					"array[0].a2": 21,
					"array[1].a1": "a12",
					"array[1].a2": 22,
				},
			];
			var ret = lib.serializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});
	});
	describe("deserializeTable()", () => {
		it("empty case", () => {
			var input = [
				{
					"name.first": "ชื่อ",
					purchased_value: "เงิน",
					"barcode[0]": "บาร์โค้ด[1]",
					create_date: "วันสมัคร",
					dateTime: "dateTime",
					time: "time",
					month: "month",
					"array[0].a1": "_array _a1[1]",
					"array[0].a2": "_array _a2[1]",
				},
			];
			var output = [];
			var ret = lib.deserializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});
		var input = [
			{
				"name.first": "ชื่อ",
				purchased_value: "เงิน",
				"barcode[0]": "บาร์โค้ด[1]",
				"barcode[1]": "บาร์โค้ด[2]",
				create_date: "วันสมัคร",
				dateTime: "dateTime",
				time: "time",
				month: "month",
				"array[0].a1": "_array _a1[1]",
				"array[0].a2": "_array _a2[1]",
				"array[1].a1": "_array _a1[2]",
				"array[1].a2": "_array _a2[2]",
			},
			{
				"name.first": "abc",
				purchased_value: 1,
				"barcode[0]": "a",
				"barcode[1]": "b",
				create_date: "2000-01-02",
				dateTime: "2000-01-02 00:00",
				time: "17:05",
				month: "2000-01",
				"array[0].a1": "a11",
				"array[0].a2": 21,
				"array[1].a1": "a12",
				"array[1].a2": 22,
			},
		];
		var output = [
			{
				name: { first: "abc" },
				purchased_value: 1,
				barcode: ["a", "b"],
				create_date: new Date("2000-01-02"),
				dateTime: new Date("2000-01-02 00:00"),
				time: new Date("1900-01-01 17:05"),
				month: new Date("2000-01-01"),
				array: [
					{ a1: "a11", a2: 21 },
					{ a1: "a12", a2: 22 },
				],
			},
		];
		it("basic case", () => {
			var ret = lib.deserializeTable(input, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});
		it("string case", () => {
			var input2 = [
				input[0],
				{
					"name.first": "abc",
					purchased_value: 1,
					"barcode[0]": "a",
					"barcode[1]": "b",
					create_date: "2000-01-02",
					dateTime: "2000-01-02 00:00",
					time: "17:05",
					month: "2000-01",
					"array[0].a1": "a11",
					"array[0].a2": "21",
					"array[1].a1": "a12",
					"array[1].a2": "22",
				},
			];
			var ret = lib.deserializeTable(input2, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});
		it("extra column case", () => {
			var input2 = [
				{ ...input[0], temp: 0 },
				{ ...input[1], temp: 0 },
			];
			var ret = lib.deserializeTable(input2, new JoiWrapper(schema));
			expect(ret).toEqual(output);
		});
		it("error case", () => {
			var input2 = [
				input[0],
				{
					"name.first": "a",
					purchased_value: "a",
					"barcode[0]": "a",
					"barcode[1]": "b",
					create_date: "2000-01-0",
					dateTime: "2000-01-02 00:00",
					time: "17:05",
					month: "2000-01",
					"array[0].a1": "a11",
					"array[0].a2": "21",
					"array[1].a1": "a12",
					"array[1].a2": "22",
				},
			];
			try {
				lib.deserializeTable(input2, new JoiWrapper(schema));
			} catch (e) {
				expect(e.errors).toEqual([
					{
						line: 3,
						label: "ชื่อ",
						message: "ต้องกรอกไม่ต่ำกว่า 3 ตัวอักษร",
						type: "string.min",
					},
					{
						line: 3,
						label: "เงิน",
						message: "ต้องเป็นตัวเลข",
						type: "number.base",
					},
					{
						line: 3,
						label: "วันสมัคร",
						message: "ต้องเป็นวันที่",
						type: "date.base",
					},
				]);
			}
		});
	});
});

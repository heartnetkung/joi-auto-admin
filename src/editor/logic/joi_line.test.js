import { makeJoiLine } from "./joi_line";
import { Joi } from "../../lib";

describe("makeJoiLine()", () => {
	it("basic object case", () => {
		var editor = { name: "a", label: "b", fieldType: "common|number" };
		var ans = makeJoiLine(editor, {}, true);
		expect(Joi.isSchema(ans)).toBe(true);
		expect(ans.validate(2)).toEqual({ value: 2 });
	});

	it("basic string case", () => {
		var editor = { name: "a", label: "b", fieldType: "common|number" };
		var ans = makeJoiLine(editor, {});
		expect(ans).toBe('Joi.number().label("b")');
	});
});

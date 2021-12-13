import { render, screen, fireEvent } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop2 } from "../mock";
import React from "react";

const startForm = async (schema) => {
	render(<AutoAdmin {...prop2} schema={schema} />);
	var createButton = await screen.findByText(/สร้าง/);
	fireEvent.click(createButton);
	await screen.findByText(/เพิ่มข้อมูลใหม่/);
};

const buildSchema = (meta, mod) => {
	meta = meta || {};
	mod = mod || ((a) => a);
	return Joi.object({
		str: mod(Joi.string()).label("str").meta(meta),
		bool: mod(Joi.bool()).label("bool").meta(meta),
		num: mod(Joi.number()).label("num").meta(meta),
		date: mod(Joi.date()).label("date").meta(meta),
		select: mod(Joi.string())
			.valid("m", "f")
			.label("select")
			.meta({ ...meta, validLabel: ["ชาย", "หญิง"] }),
		phone: mod(Joi.string())
			.label("phone")
			.meta({ ...meta, fieldType: "InputPhone" }),
		email: mod(Joi.string())
			.label("email")
			.meta({ ...meta, fieldType: "InputEmail" }),
		url: mod(Joi.string())
			.label("url")
			.meta({ ...meta, fieldType: "InputURL" }),
		nested: Joi.object({
			str: mod(Joi.string()).label("str").meta(meta),
		}),
	});
};

it("handle placeholder", async () => {
	await startForm(buildSchema({ placeholder: "a" }));
	var inputs = $$("input");
	var formItems = $$(".ant-form-item");
	var i = 0;
	expect(inputs[i++].placeholder).toBe("a");
	expect(inputs[i++].placeholder).toBeFalsy(); //checkbox
	expect(inputs[i++].placeholder).toBe("a");
	expect(inputs[i++].placeholder).toBe("a");
	expect(formItems[i].textContent).toBe("select" + "a"); //select
	expect(inputs[i++].placeholder).toBeFalsy(); //select
	expect(inputs[i++].placeholder).toBe("a");
	expect(inputs[i++].placeholder).toBe("a");
	expect(inputs[i++].placeholder).toBe("a");
	expect(inputs[i++].placeholder).toBe("a");
	expect(inputs.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle label", async () => {
	await startForm(buildSchema());
	var formItems = $$(".ant-form-item");
	var i = 0;
	expect(formItems[i++].textContent).toBe("str");
	expect(formItems[i++].textContent).toBe("bool");
	expect(formItems[i++].textContent).toBe("num");
	expect(formItems[i++].textContent).toBe("date");
	expect(formItems[i++].textContent).toBe("select");
	expect(formItems[i++].textContent).toBe("phone");
	expect(formItems[i++].textContent).toBe("email");
	expect(formItems[i++].textContent).toBe("url");
	expect(formItems[i++].textContent).toBe("str");
	expect(formItems.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle style", async () => {
	await startForm(buildSchema({ style: { color: "purple" } }));
	var formItems = $$(".ant-form-item");
	var i = 0;
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems[i++].innerHTML).toMatch("purple");
	expect(formItems.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle required, when specified", async () => {
	await startForm(buildSchema({}, (a) => a.required()));
	var formItems = $$(".ant-form-item");
	var i = 0;
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems[i++].innerHTML).toMatch("required");
	expect(formItems.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle required, default case", async () => {
	await startForm(buildSchema());
	var formItems = $$(".ant-form-item");
	var i = 0;
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems[i++].innerHTML).not.toMatch("required");
	expect(formItems.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle containerStyle", async () => {
	await startForm(buildSchema({ containerStyle: { color: "purple" } }));
	var formItems = $$(".ant-form-item").map((a) => a.parentElement);
	var i = 0;
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems[i++].style.color).toBe("purple");
	expect(formItems.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

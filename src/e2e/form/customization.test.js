import { render, screen, fireEvent, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop3 } from "../mock";
import React from "react";

const startForm = async (schema) => {
	render(<AutoAdmin {...prop3} schema={schema} />);
	var createButton = await screen.findByText(/สร้าง/);
	fireEvent.click(createButton);
	await screen.findByText(/เพิ่มข้อมูลใหม่/);
};

const submitForm = async () => {
	var createButton = await screen.findByText(/ยืนยัน/);
	act(() => {
		fireEvent.click(createButton);
	});
};

const cleanup = () =>
	$$(".ant-modal-root,.ant-dropdown,.ant-tooltop").map((a) => a.remove());
afterEach(cleanup);

it("handle fieldHide: boolean", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").meta({ fieldHide: true }),
	});
	await startForm(schema);
	var formItems = $$(".ant-form-item");
	expect(formItems.length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle fieldHide: function", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName"),
		hide: Joi.string()
			.label("hideName")
			.meta({ fieldHide: (a) => !a.foo }),
	});
	await startForm(schema);
	expect($$("input").length).toBe(1);
	act(() => {
		var input = $('input[name="foo"]');
		fireEvent.change(input, { target: { value: "123" } });
	});
	expect($$("input").length).toBe(2);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle fieldHide: function on required field", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName"),
		hide: Joi.string()
			.required()
			.label("hideName")
			.meta({ fieldHide: (a) => !a.foo }),
	});
	await startForm(schema);
	await submitForm();
	await screen.findByText(/สร้างข้อมูลเรียบร้อย/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle fieldHide: function on required field (part 2)", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName"),
		hide: Joi.string()
			.required()
			.label("hideName")
			.meta({ fieldHide: (a) => !a.foo }),
	});
	await startForm(schema);
	act(() => {
		var input = $('input[name="foo"]');
		fireEvent.change(input, { target: { value: "123" } });
	});
	await submitForm();
	await screen.findByText(/จำเป็นต้องกรอก/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle onFieldRender", async () => {
	var schema = Joi.object({
		foo: Joi.string()
			.label("fooName")
			.meta({ onFieldRender: () => <div>baka</div> }),
	});
	await startForm(schema);
	var formItems = $$(".ant-form-item");
	expect(formItems.length).toBe(1);
	expect(formItems[0].innerHTML).toMatch("fooName");
	expect(formItems[0].innerHTML).toMatch("<div>baka</div>");
	expect(console.error.mock.calls.length).toBe(0);
});

// handle callback error
import { render, screen, fireEvent, waitFor, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

const startForm = async (createMany, props) => {
	if (!createMany) createMany = jest.fn().mockImplementation(async (a) => a);
	render(<AutoAdmin {...prop1} {...props} createMany={createMany} />);
	var createButton = await screen.findByText("สร้าง");
	fireEvent.click(createButton);
	await screen.findByText(/เพิ่มข้อมูลใหม่/);
	return createMany;
};

const submitForm = async () => {
	var createButton = await screen.findByText(/ยืนยัน/);
	fireEvent.click(createButton);
};

const getCells = () => $$("tr td").filter((a) => a.style.height !== "0px");
const cleanup = () =>
	$$(".ant-modal-root,.ant-dropdown,.ant-tooltop").map((a) => a.remove());
afterEach(cleanup);

it("incorrect createMany", async () => {
	var doCreateMany = async () => {};
	var createMany = jest.fn().mockImplementation(doCreateMany);
	await startForm(createMany);
	await submitForm();
	await waitFor(() => expect(createMany.mock.calls.length).toBe(1));
	await screen.findByText(/ข้อมูลจากเซิฟเวอร์ไม่ถูกต้อง/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("catch error in createMany", async () => {
	var createMany = jest.fn().mockImplementation((a) => {
		throw new Error("amd");
	});
	await startForm(createMany);
	await submitForm();
	await waitFor(() => expect(createMany.mock.calls.length).toBe(1));

	expect(createMany.mock.calls[0][0]).toEqual([{}]);
	expect(getCells().length).toBe(1);
	await screen.findByText(/amd/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle blank submit", async () => {
	var createMany = await startForm();
	await submitForm();
	await waitFor(() => expect(createMany.mock.calls.length).toBe(1));

	expect(createMany.mock.calls[0][0]).toEqual([{}]);
	expect(getCells().length).toBe(2);
	await screen.findByText(/สร้างข้อมูลเรียบร้อย/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle blank submit with default", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").default("atk"),
	});
	var createMany = await startForm(null, { schema });
	await submitForm();
	await waitFor(() => expect(createMany.mock.calls.length).toBe(1));

	expect(createMany.mock.calls[0][0]).toEqual([{ foo: "atk" }]);
	var cells = getCells();
	expect(cells.length).toBe(2);
	expect(cells[0].textContent).toMatch("atk");
	await screen.findByText(/สร้างข้อมูลเรียบร้อย/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle type and submit", async () => {
	var createMany = await startForm();
	var input = $('input[name="foo"]');
	fireEvent.change(input, { target: { value: "lisa" } });
	await submitForm();
	await waitFor(() => expect(createMany.mock.calls.length).toBe(1));

	expect(createMany.mock.calls[0][0]).toEqual([{ foo: "lisa" }]);
	var cells = getCells();
	expect(cells.length).toBe(2);
	expect(cells[0].textContent).toMatch("lisa");
	await screen.findByText(/สร้างข้อมูลเรียบร้อย/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("do onBlur validation", async () => {
	var schema = Joi.object({
		foo: Joi.string().min(3).label("fooName"),
	});
	var createMany = await startForm(null, { schema });
	act(() => {
		var input = $('input[name="foo"]');
		fireEvent.change(input, { target: { value: "12" } });
		fireEvent.blur(input);
	});
	await waitFor(() => {
		var formItem = $(".ant-form-item");
		expect(formItem.innerHTML).toMatch("ต้องกรอกไม่ต่ำกว่า 3 ตัวอักษร");
	});
	await submitForm();
	expect(createMany.mock.calls.length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
	await wait(10); // prevent warning for failed submission
});

it("do onSubmit validation", async () => {
	var schema = Joi.object({
		foo: Joi.string().required().label("fooName"),
	});
	var createMany = await startForm(null, { schema });
	await submitForm();
	await waitFor(() => {
		var formItem = $(".ant-form-item");
		expect(formItem.innerHTML).toMatch("จำเป็นต้องกรอก");
	});
	expect(createMany.mock.calls.length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
	await wait(10); // prevent warning for failed submission
});

it("handle empty string validation (known bug)", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName"),
	});
	var createMany = await startForm(null, { schema });
	var input = $('input[name="foo"]');
	act(() => {
		fireEvent.change(input, { target: { value: " " } });
	});
	act(() => {
		fireEvent.change(input, { target: { value: "" } });
		fireEvent.blur(input);
	});
	await submitForm();
	await screen.findByText(/สร้างข้อมูลเรียบร้อย/);
	expect(createMany.mock.calls[0][0]).toEqual([{ foo: "" }]);
	expect(console.error.mock.calls.length).toBe(0);
});

import { render, screen, waitFor, fireEvent } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";

it("has delete button when deleteMany is provided", async () => {
	render(<AutoAdmin {...prop1} deleteMany={() => []} />);
	await screen.findByText(/dataName/);
	expect($('th [type="checkbox"]')).toBeTruthy();
	expect($('td [type="checkbox"]')).toBeTruthy();
	expect(console.error.mock.calls.length).toBe(0);
});

it("has no delete button by default", async () => {
	render(<AutoAdmin {...prop1} />);
	await screen.findByText(/dataName/);
	expect($$('th [type="checkbox"]').length).toBe(0);
	expect($$('td [type="checkbox"]').length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
});

it("has edit button when editOne is provided", async () => {
	render(<AutoAdmin {...prop1} updateOne={() => []} />);
	await screen.findByText(/dataName/);
	expect($$("td .anticon-edit").length).toBe(1);
	expect(console.error.mock.calls.length).toBe(0);
});

it("has no edit button by default", async () => {
	render(<AutoAdmin {...prop1} />);
	await screen.findByText(/dataName/);
	expect($$("td .anticon-edit").length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
});

it("cell format default", async () => {
	var schema = Joi.object({
		str: Joi.string().label("str"),
		bool1: Joi.bool().label("bool1"),
		bool2: Joi.bool().label("bool2"),
		bool3: Joi.bool().label("bool3"),
		num1: Joi.number().label("num1"),
		num2: Joi.number().label("num2"),
		arr1: Joi.array().label("arr1"),
		arr2: Joi.array().label("arr2"),
		arr3: Joi.array().label("arr3"),
		date1: Joi.date().label("date1"),
		date2: Joi.date().label("date2"),
		select: Joi.string()
			.valid("m", "f")
			.label("select")
			.meta({ validLabel: ["ชาย", "หญิง"] }),
		phone1: Joi.string().label("phone").meta({ fieldType: "InputPhone" }),
		phone2: Joi.string().label("phone").meta({ fieldType: "InputPhone" }),
		nullValue: Joi.string().label("nullValue"),
		undefValue: Joi.string().label("undefValue"),
	});
	var getMany = () => [
		{
			str: "abc",
			bool1: true,
			bool2: false,
			bool3: null,
			num1: 7000,
			num2: 0,
			arr1: ["hello", "world"],
			arr2: [],
			arr3: null,
			date1: new Date("2020-01-01"),
			date2: null,
			select: "m",
			phone1: "0878110952",
			phone2: "028110952",
			nullValue: null,
		},
	];
	render(<AutoAdmin {...prop1} schema={schema} getMany={getMany} />);
	await screen.findByText(/dataName/);
	var cells = $$("tr td").filter((a) => a.style.height !== "0px");
	var i = 0;
	expect(cells[i++].textContent).toBe("abc");
	expect(cells[i++].textContent).toBe("ใช่");
	expect(cells[i++].textContent).toBe("ไม่ใช่");
	expect(cells[i++].textContent).toBe("");
	expect(cells[i++].textContent).toBe("7,000");
	expect(cells[i++].textContent).toBe("0");
	expect(cells[i++].textContent).toBe("hello, world");
	expect(cells[i++].textContent).toBe("");
	expect(cells[i++].textContent).toBe("");
	expect(cells[i++].textContent).toBe("2020-01-01");
	expect(cells[i++].textContent).toBe("");
	expect(cells[i++].textContent).toBe("ชาย");
	expect(cells[i++].textContent).toBe("087-811-0952");
	expect(cells[i++].textContent).toBe("02-811-0952");
	expect(cells[i++].textContent).toBe("");
	expect(cells[i++].textContent).toBe("");
	expect(cells.length).toBe(i);
	expect(console.error.mock.calls.length).toBe(0);
});

it("cell format custom", async () => {
	var cellFormat = () => <div>hello</div>;
	var schema = Joi.object({
		str: Joi.string().label("str").meta({ cellFormat }),
	});
	render(<AutoAdmin {...prop1} schema={schema} />);
	await screen.findByText(/dataName/);
	var cells = $$("tr td").filter((a) => a.style.height !== "0px");
	expect(cells.length).toBe(1);
	expect(cells[0].innerHTML).toBe("<div>hello</div>");
	expect(console.error.mock.calls.length).toBe(0);
});

it("row action", async () => {
	var onClick = jest.fn().mockImplementation((rowData, updateData) => {
		updateData({ ...rowData, foo: "bar2" });
	});
	var rowButtons = [
		{ label: "tor", icon: <ExclamationCircleFilled />, onClick },
	];
	render(<AutoAdmin {...prop1} rowButtons={rowButtons} />);
	await screen.findByText(/dataName/);
	expect($$("tr td .anticon-exclamation-circle").length).toBe(1);
	var button = $("tr td button", /tor/);
	expect(button).toBeTruthy();
	//check before value
	var cells = $$("tr td").filter((a) => a.style.height !== "0px");
	expect(cells.length).toBe(2);
	expect(cells[0].textContent).toBe("bar");

	fireEvent.click(button);
	await waitFor(() => expect(onClick.mock.calls.length).toBe(1));
	expect(onClick.mock.calls[0][0].foo).toEqual("bar");
	expect(typeof onClick.mock.calls[0][1]).toBe("function");
	//check after value
	var cells = $$("tr td").filter((a) => a.style.height !== "0px");
	expect(cells.length).toBe(2);
	expect(cells[0].textContent).toBe("bar2");
	expect(console.error.mock.calls.length).toBe(0);
});

import { render, fireEvent, screen } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

const getColumnButtons = async () => {
	await screen.findByText(/fooName/);
	return {
		filters: $$(".anticon-filter"),
		sortUps: $$(".anticon-caret-up"),
		sortDowns: $$(".anticon-caret-down"),
	};
};

it("basic case", async () => {
	var getMany = () => [{ foo: "1" }, { foo: "2" }];
	render(<AutoAdmin {...prop1} getMany={getMany} />);
	var { filters, sortUps, sortDowns } = await getColumnButtons();
	expect(filters.length).toBe(1);
	expect(sortUps.length).toBe(1);
	expect(sortDowns.length).toBe(1);
	var allRows = $$("tr");
	expect(allRows.length).toBe(4);
	expect(allRows[2].textContent).toMatch("1");
	expect(allRows[3].textContent).toMatch("2");

	fireEvent.click(sortUps[0]);
	await wait(10);
	var allRows = $$("tr");
	expect(allRows.length).toBe(4);
	expect(allRows[2].textContent).toMatch("2");
	expect(allRows[3].textContent).toMatch("1");

	fireEvent.click(sortDowns[0]);
	await wait(10);
	var allRows = $$("tr");
	expect(allRows.length).toBe(4);
	expect(allRows[2].textContent).toMatch("1");
	expect(allRows[3].textContent).toMatch("2");

	fireEvent.click(filters[0]);
	await wait(10);
	var dropdown = $$(".ant-dropdown:not(.ant-dropdown-hidden) [type='checkbox']");
	fireEvent.click(dropdown[1]);
	await wait(10);
	var button = $(".ant-dropdown:not(.ant-dropdown-hidden) button", /OK/);
	fireEvent.click(button);
	await wait(10);
	var allRows = $$("tr");
	expect(allRows.length).toBe(3);
	expect(allRows[2].textContent).toMatch("2");
	// test warning
	// expect(console.error.mock.calls.length).toBe(0);
});

it("disableSorting", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").meta({ disableSorting: true }),
	});
	render(<AutoAdmin {...prop1} schema={schema} />);
	var { sortUps, sortDowns } = await getColumnButtons();
	expect(sortUps.length).toBe(0);
	expect(sortDowns.length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
});

it("disableFilter", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").meta({ disableFilter: true }),
	});
	render(<AutoAdmin {...prop1} schema={schema} />);
	var { filters } = await getColumnButtons();
	expect(filters.length).toBe(0);
	expect(console.error.mock.calls.length).toBe(0);
});

it("cellWidth", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").meta({ cellWidth: 112 }),
		hello: Joi.string().label("helloName"),
	});
	render(<AutoAdmin {...prop1} schema={schema} />);
	await screen.findByText("fooName");
	var col = $$("col");
	expect(col.length).toBe(1);
	expect(col[0].style.width).toMatch("112px");
	expect(console.error.mock.calls.length).toBe(0);
});

it("cellHide", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").meta({ cellHide: true }),
		hello: Joi.string().label("helloName"),
	});
	render(<AutoAdmin {...prop1} schema={schema} />);
	await screen.findByText("helloName");
	expect(screen.queryByText("fooName")).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});

it("cellShow", async () => {
	var schema = Joi.object({
		foo: Joi.string().label("fooName").meta({ cellShow: true }),
		hello: Joi.string().label("helloName"),
	});
	render(<AutoAdmin {...prop1} schema={schema} />);
	await screen.findByText("fooName");
	expect(screen.queryByText("helloName")).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});

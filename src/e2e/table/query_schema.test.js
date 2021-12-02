import { render, fireEvent, screen, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

it("basic case", async () => {
	var querySchema = Joi.object({
		foo: Joi.string().label("world").meta({ placeholder: "abc" }),
	});
	var implementation = async (q) => (q.foo ? [q] : []);
	var getMany = jest.fn().mockImplementation(implementation);

	render(
		<AutoAdmin {...prop1} querySchema={querySchema} getMany={getMany} />
	);
	await screen.findByText("world");
	await screen.findByText("No Data");
	var input = await screen.findByPlaceholderText("abc");
	var button = await screen.findByText("ดึงข้อมูล");

	fireEvent.change(input, { target: { value: "afk" } });
	fireEvent.click(button);

	await screen.findByText("afk");
	expect(getMany.mock.calls.length).toBe(2);
	expect(getMany.mock.calls[0]).toEqual([{}]);
	expect(getMany.mock.calls[1]).toEqual([{ foo: "afk" }]);
	expect(console.error.mock.calls.length).toBe(0);
});

it("getMany error", async () => {
	var getMany = async () => {
		throw new Error("omg");
	};
	render(<AutoAdmin {...prop1} getMany={getMany} />);

	var error = await screen.findByText("omg");
	expect(error.className).toMatch("modal");
	await screen.findByText("No Data");
});

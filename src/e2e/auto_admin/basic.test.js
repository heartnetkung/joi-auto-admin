import { render, fireEvent, screen, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

it("basic case", async () => {
	act(() => render(<AutoAdmin {...prop1} />));
	await screen.findByText(/bar/);
	await screen.findByText(/fooName/);
	await screen.findByText(/ข้อมูล dataName/);
	var menu = await screen.findByText(/เมนูอื่นๆ/);
	fireEvent.mouseEnter(menu);
	await screen.findByText(/ดาวน์โหลด Excel/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("require schema", async () => {
	const run = () => render(<AutoAdmin {...prop1} schema={undefined} />);
	expect(run).toThrow("Invalid Joi Object");
});

it("require getMany", async () => {
	act(() => render(<AutoAdmin {...prop1} getMany={undefined} />));
	expect(console.error.mock.calls[0][0]).toMatch(
		/`getMany` is marked as required/
	);
});

it("require name", async () => {
	act(() => render(<AutoAdmin {...prop1} name={undefined} />));
	expect(console.error.mock.calls[0][0]).toMatch(
		/`name` is marked as required/
	);
});

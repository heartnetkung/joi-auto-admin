import { render, fireEvent, screen, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

it("handle thai name", async () => {
	render(<AutoAdmin {...prop1} name="ไทย" />);
	await screen.findByText(/ข้อมูลไทย/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle en name", async () => {
	render(<AutoAdmin {...prop1} name="english" />);
	await screen.findByText(/ข้อมูล english/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle description", async () => {
	render(<AutoAdmin {...prop1} description="desc" />);
	await screen.findByText(/ข้อมูล dataName/);
	await screen.findByText(/desc/);
	expect(console.error.mock.calls.length).toBe(0);
});

import { render, screen } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

it("handle thai name", async () => {
	render(<AutoAdmin {...prop1} name="ไทย" />);
	await screen.findByText(/ข้อมูลไทย/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle en name (adding proper space)", async () => {
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

it("has create button when createMany is provided", async () => {
	render(<AutoAdmin {...prop1} createMany={() => []} />);
	await screen.findByText(/dataName/);
	expect(typeof screen.queryByText("สร้าง")).toBe('object');
	expect(console.error.mock.calls.length).toBe(0);
});

it("has no create button by default", async () => {
	render(<AutoAdmin {...prop1} />);
	await screen.findByText(/dataName/);
	expect(screen.queryByText("สร้าง")).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});

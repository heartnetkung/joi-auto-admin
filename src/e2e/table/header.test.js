import { render, screen } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

it("handle title", async () => {
	render(<AutoAdmin {...prop1} title="xxz" />);
	await screen.findByText(/xxz/);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle description", async () => {
	render(<AutoAdmin {...prop1} description="desc" />);
	await screen.findByText(/dataName/);
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

import { render, fireEvent, screen, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

const getPagination = async () => {
	await screen.findByText(/dataName/);
	var previous = screen.queryByTitle(/Previous Page/);
	var next = screen.queryByTitle(/Next Page/);
	return { previous, next };
};

it("handle empty data", async () => {
	const getMany = () => [];
	render(<AutoAdmin {...prop1} getMany={getMany} />);

	const { previous, next } = await getPagination();
	expect(previous).toBe(null);
	expect(next).toBe(null);
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle one page data", async () => {
	render(<AutoAdmin {...prop1} />);

	await screen.findByTitle("1");
	const { previous, next } = await getPagination();
	expect(previous.className).toMatch("disabled");
	expect(next.className).toMatch("disabled");
	expect(console.error.mock.calls.length).toBe(0);
});

it("handle multiple pages", async () => {
	const getMany = () => {
		var ans = [];
		for (var i = 0; i < 40; i++) ans.push({ foo: i + "x" });
		return ans;
	};
	render(<AutoAdmin {...prop1} getMany={getMany} />);
	const { previous, next } = await getPagination();
	var page1 = await screen.findByTitle("1");
	var page2 = await screen.findByTitle("2");

	await screen.findByText("1x");
	expect(previous.className).toMatch("disabled");
	expect(next.className).not.toMatch("disabled");
	expect(page1.className).toMatch("active");
	expect(page2.className).not.toMatch("active");

	fireEvent.click(page2);
	await screen.findByText("31x");
	expect(previous.className).not.toMatch("disabled");
	expect(next.className).toMatch("disabled");
	expect(page1.className).not.toMatch("active");
	expect(page2.className).toMatch("active");

	expect(console.error.mock.calls.length).toBe(0);
});

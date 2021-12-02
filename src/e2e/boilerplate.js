import "@testing-library/jest-dom";
import { Joi } from "../lib";
import { render as originalRender } from "@testing-library/react";

beforeAll(() => {
	window.matchMedia = (query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // deprecated
		removeListener: jest.fn(), // deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	});
});

beforeEach(() => {
	console.error = jest.fn();
});

export * from "@testing-library/react";

export const mock = {
	props1: {
		name: "dataName",
		getMany: async () => [{ foo: "bar" }],
		schema: Joi.object({ foo: Joi.string().label("fooName") }),
	},
};

export const render = (func) => {
	originalRender(func);
};

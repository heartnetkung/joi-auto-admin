import "@testing-library/jest-dom";
import { render as originalRender } from "@testing-library/react";

beforeAll(() => {
	// jsdom didn't mock this
	window.matchMedia = (query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(),
		removeListener: jest.fn(),
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	});
});

beforeEach(() => {
	console.error = jest.fn();
});

export * from "@testing-library/react";

// remove the return value to prevent warning
export const render = (func) => {
	originalRender(func);
};

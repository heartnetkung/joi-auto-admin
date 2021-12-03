import "@testing-library/jest-dom";
import { render as originalRender } from "@testing-library/react";
import { generateImage } from "jsdom-screenshot";
import fs from "fs";

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

var css = null;
const getCss = () => {
	if (!css)
		css = fs.readFileSync(require.resolve("antd/dist/antd.css"), "utf8");
	return css;
};

// launch pupeteer for visual debug
global.pupeteer = () => {
	var style = document.createElement("style");
	style.innerHTML = getCss();
	document.body.appendChild(style);
	generateImage({
		launch: {
			devtools: true,
			headless: false,
		},
	});
};

export const wait = (ms) => new Promise((res) => setTimeout(res, ms));

// quick chrome-style API
global.$ = document.querySelector.bind(document);
global.$$ = document.querySelectorAll.bind(document);

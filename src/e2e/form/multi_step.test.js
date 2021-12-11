import { render, screen, fireEvent, waitFor, act } from "../boilerplate";
import { AutoAdmin, Joi } from "../../lib";
import { prop1 } from "../mock";
import React from "react";

const startForm = async (createMany, props) => {
	if (!createMany) createMany = jest.fn().mockImplementation(async (a) => a);
	render(<AutoAdmin {...prop1} {...props} createMany={createMany} />);
	var createButton = await screen.findByText("สร้าง");
	fireEvent.click(createButton);
	return createMany;
};

const cleanup = () =>
	$$(".ant-modal-root,.ant-dropdown,.ant-tooltop").map((a) => a.remove());
afterEach(cleanup);

it("handle multi-step form", async () => {
	var schema = Joi.object({
		foo1: Joi.string().label("fooName1").default("atk").meta({ step: 0 }),
		foo2: Joi.string().label("fooName2").default("atk").meta({ step: 1 }),
	});
	var createMany = await startForm(null, { schema, steps: ["abbb", "cccd"] });
	await screen.findByText("abbb");
	await screen.findByText("cccd");
	var firstField = await screen.findAllByText("fooName1");
	expect(firstField.length).toBe(2);
	var secondField = await screen.findAllByText("fooName2");
	expect(secondField.length).toBe(1);
	expect(console.error.mock.calls.length).toBe(0);
});

import { Joi } from "../lib";

export const prop1 = {
	title: "dataName",
	getMany: async () => [{ foo: "bar" }],
	schema: Joi.object({ foo: Joi.string().label("fooName") }),
};

export const prop2 = {
	...prop1,
	createMany: async () => {},
};

export const prop3 = {
	...prop1,
	createMany: async (a) => a,
};

import { Joi } from "../lib";

export const prop1 = {
	name: "dataName",
	getMany: async () => [{ foo: "bar" }],
	schema: Joi.object({ foo: Joi.string().label("fooName") }),
};

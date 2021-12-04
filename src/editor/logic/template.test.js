import { renderProps, format, renderTemplate, renderJoi } from "./template";

describe("renderProps()", () => {
	it("render empty object", () => {
		var output = `({
  name: "{tableName}",
  schema: schema,
  getMany: async () => {
    await wait(500);
    return [];
  },
  devMode: false,
});
`;
		var input = {};
		expect(format(renderProps([], input), true)).toEqual(output);
	});

	it("render basic object", () => {
		var output = `({
  name: "hello",
  schema: schema,
  getMany: async () => {
    await wait(500);
    return [];
  },
  updateOne: async () => {
    await wait(500);
  },
  devMode: false,
});
`;
		var input = { name: "hello", canUpdate: true };
		expect(format(renderProps([], input), true)).toEqual(output);
	});
});

describe("renderTemplate()", () => {
	it("handle basic case", () => {
		var output = `import { Joi, AutoAdmin } from "joi_auto_admin";
import React from "react";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const schema = Joi.object({
  hello: Joi.object({
    abc: Joi.string()
      .label(helloName)
      .default(a, 2)
      .meta({ containerStyle: { marginBottom: 20 }, step: 0 }),
  }),
});

const App = () => {
  const props = {
    name: "{tableName}",
    schema: schema,
    getMany: async () => {
      await wait(500);
      return [];
    },
    steps: ["hello", "hello2"],
    devMode: false,
  };
  return <AutoAdmin {...props} />;
};

export default App;
`;
		expect(
			renderTemplate(
				[
					{
						name: "hello.abc",
						label: "helloName",
						defaultValue: ["a", 2],
						extraMargin: true,
					},
				],
				{ steps: "hello,hello2" }
			)
		).toBe(output);
	});
});

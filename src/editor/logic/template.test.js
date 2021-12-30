import { renderProps, format, renderTemplate, renderJoi } from "./template";

describe("renderProps()", () => {
	it("render empty object", () => {
		var output = `({
  title: "{tableName}",
  schema: schema,
  getMany: async () => {
    await wait(500);
    return mockData();
  },
  devMode: false,
});
`;
		var input = {};
		expect(format(renderProps([], input), true)).toEqual(output);
	});

	it("render basic object", () => {
		var output = `({
  title: "hello",
  schema: schema,
  getMany: async () => {
    await wait(500);
    return mockData();
  },
  updateOne: async () => {
    await wait(500);
  },
  devMode: false,
});
`;
		var input = { title: "hello", canUpdate: true };
		expect(format(renderProps([], input), true)).toEqual(output);
	});
});

describe("renderTemplate()", () => {
	it("handle basic case", () => {
		var output = `import { Joi, AutoAdmin, Chance } from "joi_auto_admin";
import React from "react";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const chance = new Chance(0);

const schema = Joi.object({
  hello: Joi.object({
    abc: Joi.string()
      .label("helloName")
      .default(["a", 2])
      .meta({ containerStyle: { marginBottom: 20 }, step: 0 }),
  }),
});

const mockData = () => {
  const ans = [];
  for (let i = 0; i < 3; i++) ans.push({ hello: { abc: chance.word() } });
  return ans;
};

const App = () => {
  const props = {
    title: "{tableName}",
    schema: schema,
    getMany: async () => {
      await wait(500);
      return mockData();
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
						defaultValue: '["a", 2]',
						extraMargin: true,
					},
				],
				{ steps: "hello,hello2" }
			)
		).toBe(output);
	});
});

import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import React from "react";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		name: "ลูกค้า",
		getMany: async (query) => {
			return [];
		},
		createMany: async (rowArray) => {
			await wait(1000);
			//add unique id from server
			return rowArray.map((a) => ({ ...a, _id: Math.random() }));
		},
		schema: Joi.object({
			a: Joi.string()
				.label("a")
				.meta({ fieldHide: (value, currentStep) => currentStep !== 0 }),
			b: Joi.string()
				.label("b")
				.meta({
					fieldHide: (value, currentStep) => currentStep !== 1,
					twoColumn: true,
				}),
			interactive: Joi.string()
				.label("interactive")
				.meta({
					fieldHide: (value, currentStep) =>
						!value.b || currentStep !== 1,
					twoColumn: true,
				}),
		}),
		steps: ["c", "d"],
	};

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<AutoAdmin {...props} />
		</center>
	);
};

export default App;

import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import options from "./lib/assets/district.json";
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
			province2: Joi.string()
				.label("province2")
				.meta({
					cascader: {
						label: "จังหวัด",
						compLabels: ["district2"],
						fieldNames: { label: "l", value: "l", children: "c" },
						options,
					},
				}),
			district2: Joi.string().label("district2"),
			category: Joi.string()
				.label("category")
				.meta({
					cascader: {
						label: "ประเภทรถ",
						compLabels: ["brand"],
						fieldNames: { label: "l", value: "l", children: "c" },
						options: [
							{ l: "รถเก๋ง", isLeaf: false },
							{ l: "มอไซ", isLeaf: false },
						],
						asyncLoad: async (selected) => {
							await wait(500);
							var last = selected[selected.length - 1];
							if (last.l === "รถเก๋ง")
								last.c = [{ l: "benz" }, { l: "toyota" }];
							else last.c = [{ l: "yamaha" }, { l: "honda" }];
						},
					},
				}),
			brand: Joi.string().label("brand"),
		}),
		querySchema: Joi.object({
			purchased_value: Joi.string()
				.valid("ทั้งหมด", "3000-3004", "3005-3009")
				.default("ทั้งหมด")
				.label("เงิน"),
		}),
	};

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<AutoAdmin {...props} />
		</center>
	);
};

export default App;

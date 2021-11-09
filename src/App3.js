import Joi from "joi/lib/index";
import AutoAdmin from "./controller";
import options from "./assets/district.json";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		name: "ลูกค้า",
		getMany: async (query) => {
			await wait(500);
			const data = [];
			for (let i = 0; i < 100; i++)
				data.push({
					name: `Edward King ${i}`,
					purchased_value: 3000 + Math.round(10 * Math.random()),
					create_date: new Date(),
					sex: "m",
				});
			if (query.purchased_value === "3000-3004")
				return data.filter((a) => a.purchased_value < 3005);
			else if (query.purchased_value === "3005-3009")
				return data.filter((a) => a.purchased_value >= 3005);
			return data;
		},
		createMany: async (rowArray) => {
			await wait(1000);
			//add unique id from server
			return rowArray.map((a) => ({ ...a, _id: Math.random() }));
		},
		updateOne: async (rowObj) => {
			await wait(1000);
		},
		deleteMany: async (rowArray) => {
			await wait(1000);
		},
		schema: Joi.object({
			name: Joi.string()
				.min(3)
				.max(30)
				.required()
				.label("ชื่อ")
				.meta({ placeholder: "ชื่อภาษาไทย" }),
			purchased_value: Joi.number()
				.integer()
				.label("เงิน")
				.meta({ twoColumn: true }),
			create_date: Joi.date()
				.default(Date.now)
				.label("วันสมัคร")
				.meta({ disabled: true, twoColumn: true }),
			sex: Joi.string()
				.valid("m", "f")
				.default("m")
				.label("เพศ")
				.meta({ validLabel: ["ชาย", "หญิง"], twoColumn: true }),
			province2: Joi.string()
				.label("province")
				.meta({
					cascader: {
						label: "abc",
						index: 0,
						fieldNames: { label: "l", value: "l", children: "c" },
						options,
						asyncLoad: async (selected) => {
							await wait(500);
							var last = selected[selected.length - 1];
							last.c = [{ l: 1 }, { l: 2 }];
						},
					},
				}),
			district2: Joi.string()
				.label("district")
				.meta({
					cascader: {
						label: "abc",
						index: 1,
						fieldNames: { label: "l", value: "l", children: "c" },
						options,
						asyncLoad: async (selected) => {
							await wait(500);
							var last = selected[selected.length - 1];
							last.c = [{ l: 1 }, { l: 2 }];
						},
					},
				}),
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

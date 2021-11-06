import Joi from "joi/lib/index";
import AutoAdmin from "./controller";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		name: "ลูกค้า",
		getMany: async () => {
			const data = [];
			for (let i = 0; i < 100; i++)
				data.push({
					_id: i,
					name: `Edward King ${i}`,
					purchased_value: 3000 + Math.round(10 * Math.random()),
					district: ["กรุงเทพมหานคร", "ยานนาวา"],
					create_date: new Date(),
				});
			return data;
		},
		createMany: async (a) => {
			await wait(1000);
		},
		updateOne: async (a) => {
			await wait(1000);
		},
		deleteMany: async (a) => {
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
			district: Joi.array()
				.label("เขต")
				.meta({ fieldType: "AddressDistrict", twoColumn: true }),
			create_date: Joi.date()
				.default(Date.now)
				.label("วันสมัคร")
				.meta({ disabled: true, twoColumn: true }),
		}),
	};

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<AutoAdmin {...props} />
		</center>
	);
};

export default App;

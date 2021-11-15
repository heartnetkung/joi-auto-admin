import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import React from "react";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		name: "การติดตาม",
		getMany: async (query) => {
			await wait(500);
			var record = {
				call_date: new Date("2021-02-01"),
				customer_id: "0078",
				call_received: false,
				next_call_date: new Date("2021-03-01"),
				remark: "-",
			};
			return [record];
		},
		schema: Joi.object({
			call_date: Joi.date().label("วันที่ติดต่อ"),
			customer_id: Joi.string().label("รหัสลูกค้า"),
			call_received: Joi.boolean()
				.label("รับสาย")
				.meta({ cellFormat: (a) => (a ? "รับ" : "ไม่รับ") }),
			next_call_date: Joi.date()
				.label("โทรครั้งถัดไป")
				.meta({ cellWidth: 140 }),
			remark: Joi.string().label("หมายเหตุ"),
		}),
	};

	return (
		<center style={{ maxWidth: 1024, margin: "auto", marginTop: 40 }}>
			<AutoAdmin {...props} />
		</center>
	);
};

export default App;

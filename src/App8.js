import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import React from "react";
import { customer } from "./App7";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		name: "ลูกค้า",
		getMany: async (query) => {
			await wait(500)
			var customer = {
				customer_id: "0078",
				firstname: "tor",
				lastname: "tor",
				tel: "0878110951",
				otp: "123456",
				contracts: ["1123"],
			};
			return [{ customer }];
		},
		updateOne: async (rowObj) => {
			await wait(1000);
		},
		deleteMany: async (rowArray) => {
			await wait(1000);
		},
		schema: Joi.object({ customer }),
		steps: ["ข้อมูลบัตรปชช", "ข้อมูลลูกค้า", "ผู้ติดต่อได้"],
		rowButtons: [
			{ label: "สร้างสัญญา" },
			{ label: "การติดตาม", onClick: () => alert("go to App9") },
		],
		querySchema: Joi.object({
			customer_id: Joi.string().min(3).label("รหัสลูกค้า"),
			firstname: Joi.string().min(3).label("ชื่อจริง"),
		}),
	};

	return (
		<center style={{ maxWidth: 1024, margin: "auto", marginTop: 40 }}>
			<AutoAdmin {...props} />
		</center>
	);
};

export default App;

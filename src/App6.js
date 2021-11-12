import Joi from "joi/lib/index";
import React from "react";
import { openFormModal } from "./lib/controller/open_form_modal";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		title: "เพิ่มข้อมูล",
		onSubmit: async (formData) => {
			await wait(1000);
		},
		schema: Joi.object({
			a: Joi.string().label("a").required().min(2),
			barcode: Joi.array()
				.label("บาร์โค้ด")
				.meta({
					placeholder:
						"ยิงบาร์โค้ดหรือพิมพ์แล้วกด Enter เพื่อเพิ่มแถว (ลอง 001 / 002)",
					loadBarcodeName: async (barcode) => {
						await wait(500);
						if (barcode === "001") return "iPhone";
						if (barcode === "002") return "Samsung";
					},
				}),
		}),
	};
	const onClick = () => openFormModal(props);

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<button onClick={onClick}>เปิดฟอร์ม</button>
		</center>
	);
};

export default App;

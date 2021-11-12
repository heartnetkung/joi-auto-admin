import Joi from "joi/lib/index";
import React from "react";
import { Button } from "antd";
import { openFormModal } from "./lib/controller/open_form_modal";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
	const props = {
		title: "ลูกค้า",
		onSubmit: async (formData) => {
			await wait(1000);
		},
		schema: Joi.object({
			a: Joi.string().label("a").required().min(2),
			b: Joi.string().label("b"),
		}),
	};
	const onClick = () => openFormModal(props);

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<Button onClick={onClick}>เปิดฟอร์ม</Button>
		</center>
	);
};

export default App;

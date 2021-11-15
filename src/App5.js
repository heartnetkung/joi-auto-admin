import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import React from "react";
import { openFormModal } from "./lib/controller/open_form_modal";

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
			a: Joi.string().label("a").required().min(2).meta({ step: 0 }),
			b: Joi.string().label("b").meta({
				step: 1,
				twoColumn: true,
			}),
			interactive: Joi.string()
				.label("interactive")
				.meta({
					fieldHide: (value) => !value.b,
					step: 1,
					twoColumn: true,
				}),
		}),
		steps: ["c", "d"],
		rowButtons: [
			{
				label: "edit only a",
				onClick: (rowData, setRowData) => {
					openFormModal({
						schema: Joi.object({
							a: Joi.string().label("a").required().min(2),
						}),
						onSubmit: (formData) => {
							wait(500);
							setRowData({ ...rowData, ...formData });
						},
						title: 'แก้ไขข้อมูล'
					});
				},
			},
		],
	};

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<AutoAdmin {...props} />
		</center>
	);
};

export default App;

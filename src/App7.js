import Joi from "joi/lib/index";
import React from "react";
import { openFormModal } from "./lib/controller/open_form_modal";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const step0 = (a, step) => step !== 0;
const step1 = (a, step) => step !== 1;
const step1a = (a, step) => step !== 1 || a.customer.job_cat !== "employed";
const step1b = (a, step) => step !== 1 || a.customer.job_cat !== "student";
const step2 = (a, step) => step !== 2;
const step3 = (a, step) => step !== 3;

export const customer = Joi.object({
	//tableOnly
	customer_id: Joi.string()
		.label("รหัสลูกค้า")
		.meta({ fieldHide: true, cellShow: true, cellWidth: 60 }),

	//step0
	$cardReader: Joi.string()
		.label("เครื่องอ่านบัตร")
		.meta({ containerStyle: { marginBottom: 30 }, fieldHide: step0 }),
	firstname: Joi.string()
		// .required()
		.label("ชื่อจริง")
		.meta({ twoColumn: true, fieldHide: step0, cellShow: true }),
	lastname: Joi.string()
		// .required()
		.label("นามสกุล")
		.meta({ twoColumn: true, fieldHide: step0, cellShow: true }),
	gender: Joi.string()
		.valid("m", "f")
		// .required()
		.label("เพศ")
		.meta({
			twoColumn: true,
			fieldHide: step0,
			validLabel: ["ชาย", "หญิง"],
		}),
	birthday: Joi.date()
		// .required()
		.label("วันเกิด")
		.meta({ twoColumn: true, fieldHide: step0 }),
	address: Joi.string()
		.max(1000)
		// .required()
		.label("ที่อยู่บรรทัดแรก")
		.meta({ fieldHide: step0 }),
	province: Joi.string()
		.label("จังหวัด")
		.meta({
			cascader: {
				label: "จังหวัด/เขต/แขวง",
				options: "th-address",
				compLabels: ["เขต/อำเภอ", "แขวง/ตำบล", "รหัสไปรษณีย์"],
				fieldHide: step0,
			},
		}),
	district: Joi.string().label("เขต/อำเภอ"),
	subsidtrict: Joi.string().label("แขวง/ตำบล"),
	zipcode: Joi.string().label("รหัสไปรษณีย์"),

	//step1
	tel: Joi.string().label("เบอร์โทรศัพท์").meta({
		fieldHide: step1,
		twoColumn: true,
		cellShow: true,
		cellWidth: 120,
		fieldType: "InputPhone",
	}),
	facebook: Joi.string()
		.label("เฟซบุ๊ค")
		.meta({ fieldHide: step1, twoColumn: true }),
	lineId: Joi.string()
		.label("ไลน์ไอดี")
		.meta({ fieldHide: step1, twoColumn: true }),
	photo: Joi.string()
		.label("รูปถ่าย")
		.meta({ fieldHide: step1, placeholder: "รอนัททำ", twoColumn: true }),
	job_cat: Joi.string()
		.valid("employed", "student")
		.default("employed")
		.label("ประเภทงาน")
		.meta({
			fieldHide: step1,
			validLabel: ["ทำงาน", "นักเรียน"],
			containerStyle: { marginTop: 30 },
		}),

	//step1a
	job: Joi.string()
		.label("อาชีพปัจจุบัน")
		.meta({ fieldHide: step1a, twoColumn: true }),
	job_title: Joi.string()
		.label("ตำแหน่งงาน")
		.meta({ fieldHide: step1a, twoColumn: true }),
	job_duration: Joi.number()
		.label("อายุการทำงาน")
		.meta({ fieldHide: step1a, twoColumn: true }),
	job_salary: Joi.number()
		.label("รายได้ต่อเดือน")
		.meta({ fieldHide: step1a, twoColumn: true }),
	company: Joi.string()
		.label("บริษัทปัจจุบัน")
		.meta({ fieldHide: step1a, twoColumn: true }),
	company_tel: Joi.string()
		.label("เบอร์โทรที่ทำงาน")
		.meta({ fieldHide: step1a, twoColumn: true, fieldType: "InputPhone" }),
	company_address: Joi.string()
		.label("ที่อยู่บริษัท")
		.meta({ fieldHide: step1a }),

	//step1b
	education_level: Joi.string()
		.valid("ม.ปลาย", "ปวช", "ปวส", "ป.ตรี", "สูงกว่าป.ตรี")
		.default("ป.ตรี")
		.label("การศึกษาปัจจุบัน")
		.meta({
			fieldHide: step1b,
			twoColumn: true,
			validLabel: ["ม.ปลาย", "ปวช", "ปวส", "ป.ตรี", "สูงกว่าป.ตรี"],
		}),
	education_year: Joi.number()
		.min(1)
		.max(6)
		.label("ชั้นปีที่")
		.meta({ fieldHide: step1b, twoColumn: true }),
	school_name: Joi.string()
		.label("ชื่อสถานศึกษา")
		.meta({ fieldHide: step1b, twoColumn: true }),
	faculty: Joi.string()
		.label("คณะ")
		.meta({ fieldHide: step1b, twoColumn: true }),
	hasStudentLoad: Joi.bool()
		.default(false)
		.label("กู้กยศ./กรอ.หรือไม่")
		.meta({ fieldHide: step1b, twoColumn: true }),
	department: Joi.string()
		.label("สาขาวิชา")
		.meta({ fieldHide: step1b, twoColumn: true }),

	//step2
	contact_person1: Joi.object({
		firstname: Joi.string()
			// .required()
			.label("ชื่อจริง1")
			.meta({ twoColumn: true, fieldHide: step2 }),
		lastname: Joi.string()
			// .required()
			.label("นามสกุล1")
			.meta({ twoColumn: true, fieldHide: step2 }),
		tel: Joi.string()
			// .required()
			.label("เบอร์โทรศัพท์1")
			.meta({
				twoColumn: true,
				fieldHide: step2,
				fieldType: "InputPhone",
			}),
		relationship: Joi.string()
			.label("ความสัมพันธ์1")
			.meta({
				twoColumn: true,
				fieldHide: step2,
				containerStyle: { marginBottom: 30 },
			}),
	}),
	contact_person2: Joi.object({
		firstname: Joi.string()
			// .required()
			.label("ชื่อจริง2")
			.meta({ twoColumn: true, fieldHide: step2 }),
		lastname: Joi.string()
			// .required()
			.label("นามสกุล2")
			.meta({ twoColumn: true, fieldHide: step2 }),
		tel: Joi.string()
			// .required()
			.label("เบอร์โทรศัพท์2")
			.meta({
				twoColumn: true,
				fieldHide: step2,
				fieldType: "InputPhone",
			}),
		relationship: Joi.string()
			.label("ความสัมพันธ์2")
			.meta({
				twoColumn: true,
				fieldHide: step2,
				containerStyle: { marginBottom: 30 },
			}),
	}),
	contact_person3: Joi.object({
		firstname: Joi.string()
			// .required()
			.label("ชื่อจริง3")
			.meta({ twoColumn: true, fieldHide: step2 }),
		lastname: Joi.string()
			// .required()
			.label("นามสกุล3")
			.meta({ twoColumn: true, fieldHide: step2 }),
		tel: Joi.string()
			// .required()
			.label("เบอร์โทรศัพท์3")
			.meta({
				twoColumn: true,
				fieldHide: step2,
				fieldType: "InputPhone",
			}),
		relationship: Joi.string()
			.label("ความสัมพันธ์3")
			.meta({
				twoColumn: true,
				fieldHide: step2,
				containerStyle: { marginBottom: 30 },
			}),
	}),

	//tableOnly
	otp: Joi.string()
		.label("OTP")
		.meta({ fieldHide: true, cellShow: true, cellWidth: 100 }),
	contracts: Joi.array()
		.label("สัญญา")
		.meta({
			fieldHide: true,
			cellShow: true,
			cellWidth: 80,
			cellFormat: (data) =>
				data.map((a, i) => (
					<a key={a} href={"https://www.google.com?q=" + a}>
						{"สัญญา" + (i + 1)}
					</a>
				)),
		}),
});

const contract = Joi.object({
	itemNos: Joi.array()
		.min(1)
		.label("บาร์โค้ดสินค้า")
		.meta({
			loadBarcodeName: async (a) => {
				await wait(500);
				return "iPhone";
			},
			fieldHide: step3,
			containerStyle: { marginBottom: 30 },
		}),
	contracType: Joi.string()
		.valid("loan", "refinance")
		.required()
		.label("ประเภทสัญญา")
		.meta({
			fieldHide: step3,
			validLabel: ["ผ่อนสินค้า", "รีไฟแนนซ์"],
			twoColumn: true,
		}),
	upfront: Joi.number()
		.required()
		.min(0)
		.label("เงินดาวน์")
		.meta({ fieldHide: step3, twoColumn: true }),
	promotion_code: Joi.string()
		.valid("none")
		.default("none")
		.label("รหัสโปรโมชั่น")
		.meta({ fieldHide: step3, twoColumn: true, validLabel: ["ไม่มี"] }),
});

const App = () => {
	const props1 = {
		onSubmit: async (formData) => {
			await wait(500);
			console.log(formData);
		},
		title: "",
		schema: Joi.object({ customer, contract }),
		steps: ["ข้อมูลบัตรปชช", "ข้อมูลลูกค้า", "ผู้ติดต่อได้", "ทำสัญญา"],
	};

	const props2 = {
		onSubmit: async (formData) => {
			await wait(500);
			console.log(formData);
		},
		title: "",
		schema: Joi.object({ customer }),
		steps: ["ข้อมูลบัตรปชช", "ข้อมูลลูกค้า", "ผู้ติดต่อได้"],
	};

	const onClick1 = () => openFormModal(props1);
	const onClick2 = () => openFormModal(props2);

	return (
		<center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
			<button onClick={onClick1}>สร้างลูกค้าพร้อมสัญญา</button>
			<br />
			<br />
			<button onClick={onClick2}>สร้างลูกค้าอย่างเดียว</button>
		</center>
	);
};

export default App;

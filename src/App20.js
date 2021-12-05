import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import React from "react";
import ColImage from "./lib/test-cell-component/col_image";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
  const props = {
    name: "ลูกค้า",
    getMany: async (query) => {
      await wait(500);
      const data = [];
      for (let i = 0; i < 10; i++)
        data.push({
          name: `Edward King ${i}`,
          purchased_value: 3000 + Math.round(10 * Math.random()),
          create_date: new Date(),
          sex: "m",
          image: [],
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
      image: Joi.array()
        .label("รูป")
        .meta({
          multiple: true,
          imagePreview: true,
          uploadFileType: "image",
          firebaseConfig: {
            apiKey: "",
            authDomain: "",
            projectId: "",
            storageBucket: "",
            messagingSenderId: "",
            appId: "",
            measurementId: "",
          },
          collectionName: "products",
          prefixFileName: "iPhone",
          requireImageSize: true,
          cellWidth: 150,
          cellFormat: (cellData) => (
            <ColImage src={cellData} keyUrl="renderUrl" />
          ),
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
    <center style={{ maxWidth: 1000, margin: "auto", marginTop: 40 }}>
      <AutoAdmin {...props} />
    </center>
  );
};

export default App;

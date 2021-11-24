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
          uploadFileType: "image",
          imagePreview: true,
          getUploadUrl: async (fileType) => {
            await wait(500);
            return "https://storage.googleapis.com/ufriend-payment_slip/slip_CT21AH473W_1637645670038.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ufriend-gcp%40ufriend-328114.iam.gserviceaccount.com%2F20211123%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20211123T053430Z&X-Goog-Expires=900&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=21eed197faba052c9142824006b6e8c0825b948a58fc329e3b1ae1049e8486a3ad33eec60f335954de74af2bb147d85a0e8fe7b40abf00e229cdd0645b70057721f75f45a0a44284bcb3742bf0b6140cd27201a494775925703b735d5adda222eb08da9503966b247ec04afc2125bd2f0a9035904e69bb9f5fb35d64a6d691cc181ad9ce5b172c043e138bf031ffbd3f2a29807b2334d3fbb2c06238090b36d36c34ab0d1ff59a4d18e27c7abf57ff94ba7f44b367ebd77d14b34dcd220c5c556b5083b3632e5cdf2550abdd93fd021739c130afc7d12aa65bf968f62ee4b0c9ed91d16b72bae6ffb5e40feb6d62bc00d7520316ab6bdf372f19f1d183406dc8";
          },
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

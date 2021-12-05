import Joi from "joi/lib/index";
import AutoAdmin from "./lib/controller";
import React from "react";

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
            return "https://storage.googleapis.com/ufriend-payment_slip/slip_1411700133025_1637750262301.png?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=ufriend-gcp%40ufriend-328114.iam.gserviceaccount.com%2F20211124%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20211124T103742Z&X-Goog-Expires=900&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=6f74456b63ba806c3a4422f85842004bf0529876d7a92e729e1dbd831e78544abdc60f4b55b5929b41746750227b03477416899a6a78437c8f93e070d30e509c8fbcb53cdcb4aacf76c85ff53a6441bceaed70fbce3d42d66679bed915b11a83b5d23b5c166645ffcdb026b30fd8fef06cdb166302453419fde792ea6ff0c202270a497782ee75717f4072df1048fcfc1ccd9d1e68658faa35970278fb2ade75a278b1a8f682ae9b6d94d5ba3714a3299c67c75c40e2eeae8a4d3c35ca3db5e9925fec4165b7ec341c285b863c1886ee7647bc23c605240f63a3373c6894906516baf0405ad38144ddfec3ebd60e42757976ad8f1a974dc14be2c68354d00933";
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
    <center style={{ maxWidth: 1000, margin: "auto", marginTop: 40 }}>
      <AutoAdmin {...props} />
    </center>
  );
};

export default App;

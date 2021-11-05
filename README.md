## Description
As a developer in a company, we spend a lot of time writing web-based tools for our staffs and back office usage. This package aims to automate such work completely on the front-end side.

The idea is to provide a react component called `AutoAdmin` which take minimal output and automatically render a complete UI. Some of the features include:
- A table for GET operation
  - this table can sort 
  - this table can filter
  - this table can export data to excel format
  - this table can do pagination
  - this table can have their rows selected for DELETE operation
- A form for creating and editing data
  - this form can validate input data by itself on front-end with all errors translated to Thai language
  - this form can import excel data
  - this form are rendered automatically from specified `Joi Object`.

## Example
```jsx
import {Joi, AutoAdmin} from 'joi-auto-admin'

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

      purchased_value: Joi.number().integer().label("เงิน"),
      district: Joi.array()
        .label("เขต")
        .meta({ fieldType: "AddressDistrict" }),
      create_date: Joi.date()
        .default(Date.now)
        .label("วันสมัคร")
        .meta({ disabled: true }),
    }),
  };

  return (
    <center style={{ maxWidth: 800, margin: "auto", marginTop: 40 }}>
      <AutoAdmin {...props} />
    </center>
  );
};

export default App;
```

## Joi Input Explanation
- `.label(str)` 
  - Required for this field to appear in the UI. This field is used as table header and form label.
- `.meta(obj)`
  - The meta function allows you to customize each data field.
  - Object are parsed directly as a prop to input. Some of the most popular ones inlcude:
    - `.meta({ placeholder })`
    - `.meta({ disabled })`
    - `.meta({ defaultValue })`
    - `.meta({ autoFocus })`
    - The rest of the props can be found [here.](https://reactjs.org/docs/dom-elements.html)
  - There are certain keys you can use to customize `AutoAdmin` itself
    - `.meta({ fieldType: string | ReactComponent })`
    - `.meta({ fieldInline: boolean })`
    - `.meta({ fieldValidation: ()=> string|null })`
    - `.meta({ cellAlign: 'left'|'right'|'center' })`
    - `.meta({ cellEditable: boolean })`
    - `.meta({ cellEllipsis: boolean })`
    - `.meta({ cellTextFormat: (rowData)=>string })`
    - `.meta({ cellWidth: number })`

- `.required(str)`
  - For required fields.
- `.default(value)`
  - For providing the default value in data-creating form.
- `.valid()`
  - For making dropdown inputs.


## Props API
|Name|Description|Type|Required|Default|
|---|---|---|---|---|
|schema|[Joi Object] or async ()=> {Joi Object} |true
|name|string|true
|getMany| async (spec)=> [{rowData}]|true
|createMany| async (arrayOfObject)=> null|false|null
|updateOne| async (newObject)=> null|false|null
|DeleteMany| async (arrayOfObject)=> null|false|null
|actions|[{onClick: (data)=> null}]|false|[]

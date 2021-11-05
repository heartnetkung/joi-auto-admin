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
- `.default(value)`
- `.valid()`
  - For making dropdown inputs.


## Props API
|Name|Description|Type|DefaultValue|
|---|---|---|---|
|schema|specification on how the UI will render|{Joi Object} or async ()=> {Joi Object} |`required`|
|name|name of this data|string|`required`|
|getMany|the function connecting to back-end API. If you provide querySchema, query object will be provided|async (query)=> [{rowData}]|`required`|
|createMany|if not provided, the createButton will not show|async ([rowData])=> null|null|
|updateOne||if not provided, the updateButton will not show|async (newRowData)=> null|null|
|deleteMany|if not provided, the rows can't be selected|async ([rowData])=> null|null|
|rowActions|custom actions for each row|[{onClick: (rowData)=> null, icon: AntIcon, label: string}]|[]|
|querySchema|specification of query for getMany operation|{Joi Object} or async ()=> {Joi Object}|null|
|tableScroll|viewport size for scrolling|object|{ y: 600 }|
|canDownloadExcel|show button for downloading all the data in this table to excel|boolean|true|
|canUploadExcel|show both the uploadButton and uploadPreviewButton|boolean|true|
|uploadPreviewUrl|if specified, the uploadPreviewButton will download file from this path instead of the first 3 rows of this table|string|null|


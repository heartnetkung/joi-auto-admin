# Joi Auto Admin
Automatically create a full-featured web admin UI for CRUD operations using only a few props.

## Overview
As a developer in a company, we spend a lot of time writing web-based tools for our staffs and back office usage. This package aims to automate such work completely on the front-end side.

The idea is to provide a `react component` called `AutoAdmin` which take minimal output and automatically render a complete UI. It's mainly composed of 2 components:
1. A table for GET operation with the following features:
  - sort, filter, pagination
  - export data to excel format
  - select rows for DELETE operation
  - responsive
  - support customizable button for each row
  - expandable row
2. A form for CREATE and UPDATE operation
  - render automatically from specified `Joi Object`.
  - import excel data
  - automatically validate form data and excel data before sending it to server
    - all errors are pre-translated into Thai language
  - support multiple pre-configure inputs such as image uploader, address input, heirarchical dropdown, ajax dropdown, and date picker
  - support custom react input

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

## Joi Object Explanation
- `.label(str)` 
  - Required. Label is used as table header, excel header, and form label.
- `.meta(obj)`
  - The meta function allows you to customize each data field.
  - Object are parsed directly as a prop to input. Some of the most popular ones inlcude:
    - `.meta({ placeholder })`
    - `.meta({ disabled })`
    - `.meta({ defaultValue })`
    - The rest of the props can be found [here.](https://reactjs.org/docs/dom-elements.html)
  - There are certain keys you can use to customize `AutoAdmin` itself
    - `.meta({ fieldType: string | ReactComponent })`
    - `.meta({ fieldValidation: ()=> string|null })`
    - `.meta({ twoColumn: boolean })`
      - show the form input in half size, so you can stack 2 fields in the same line.
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
|schema|specification on how the UI will render|{Joi Object} or<br> async ()=> {Joi Object} |`required`|
|name|name of this data|string|`required`|
|getMany|the function connecting to back-end API. If `querySchema` is provided, query object will be derived from user input|async (query)=> [{rowData}]|`required`|
|createMany|if not provided, the createButton will not show|async ([rowData])=> null|null|
|updateOne|if not provided, the updateButton will not show|async (newRowData)=> null|null|
|deleteMany|if not provided, the rows can't be selected|async ([rowData])=> null|null|
|rowButtons|custom buttons for each row|[{onClick: (rowData)=> null,<br> icon: AntIcon,<br> label: string}]|[]|
|querySchema|specification of query for getMany operation|{Joi Object} or<br> async ()=> {Joi Object}|null|
|tableScroll|viewport size for scrolling|object|{ y: 600 }|
|canDownloadExcel|show button for downloading all the data in this table to excel|boolean|true|
|canUploadExcel|show both the uploadButton and the uploadPreviewButton|boolean|true|
|uploadPreviewUrl|if specified, the uploadPreviewButton will download file from this path instead of the first 3 rows of this table|string|null|


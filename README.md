# joi-auto-admin

Create a full-featured customizable web admin UI for CRUD operations using web-based code generator (similar to Google Form).

## Installation

```bash
npm install joi-auto-admin
```

## Try it out

[Code Generator UI](https://heartnetkung.github.io/joi-auto-admin)

## Overview

As a developer in a company, we spend a lot of time writing web-based tools for our staffs and back office usage. This package aims to automate such work completely on the front-end side.

The idea is to provide a `react component` called `AutoAdmin` which take minimal output and automatically render a complete UI. It's mainly composed of 2 components:

1\. A table for GET operation with the following features:

- sort, filter, pagination
- export data to excel format
- select rows for DELETE operation
- responsive
- support customizable button for each row
- ~~expandable row~~

2\. A form for CREATE and UPDATE operation with the following features:

- render automatically from specified `Joi Object`.
- import excel data
- automatically validate form data and excel data before sending it to server
  - all errors are pre-translated into Thai language
- support multiple pre-configured inputs such as image uploader, address input, heirarchical dropdown, ajax dropdown, and date picker
- support custom react input

## FAQ

1. How do I change Antd theme color?

- You can override css in your project by importing directly from antd.
  1. Generate css theme of your choice by using this [tool](https://github.com/emeks-studio/antd-custom-theme-generator).
  2. `import 'my-theme.css'` in your code after you import joi-auto-admin to override css style.

2. I got eslint warning about strict mode?

- Remove component `<React.StrictMode>`. [Antd library doesn't support it.](https://github.com/ant-design/ant-design/issues/22493)

3. How do I handle nested object?

- You can add dot in field name to denote nested object. For example:
  - `name-1234` would render to `Joi.object({ "name-1234": Joi.string() })`
  - `hello.name-1234` would render to `Joi.object({ "hello": Joi.object({ "name-1234": Joi.string() }) })`

## Joi Object API

- `.label(str)`
  - Required. Label is used as table header, excel header, and form label.
- `.meta(obj)`
  - The meta function allows you to customize each data field.
  - Object are parsed directly as a prop to input. Some of the most popular ones inlcude:
    - `.meta({ placeholder })`
    - `.meta({ disabled })`
    - `.meta({ style })`
    - The rest of the props can be found [here.](https://reactjs.org/docs/dom-elements.html)
  - To customize **form**, use the following fields:
    - `.meta({ fieldType: string })`
      - Useful ones are `InputPhone`, `InputEmail`, `InputURL`. The rest are automatic depending on other parameters, for example, boolean would be checkbox.
    - `.meta({ fieldHide: boolean | (formValue, currentStep)=>boolean })`
      - Hide the current field. Useful for making interactive or multi-step form.
    - `.meta({ twoColumn: boolean })`
      - Show the form input in half size, so you can stack 2 fields in the same line.
    - `.meta({ step: number })`
      - When you use multi-step form, this field specify which page the field is in.
    - `.meta({ containerStyle: styleObj })`
      - Customize style of the field container, useful for adding margins or padding.
    - `.meta({ onFieldRender: (props)=>ReactDomNode })`
      - \[Advanced\] fully customize the form component. The function usually implements with `import { useFormikContext } from "formik";` to get/set internal value of the form. See the example for more information.
  - To customize **table**, use the following fields:
    - `.meta({ cellEllipsis: true })`
    - `.meta({ cellFormat: (cellData)=> string | ReactDomNode })`
      - For formating number, date, etc. on the table.
    - `.meta({ cellWidth: number })`
    - `.meta({ cellHide: true })` and `.meta({ cellShow: true })`
      - For selectively show or hide certain fields from table view
    - `.meta({ disableSorting: true })`
      - For disabling column sorting
    - `.meta({ disableFilter: true })`
      - For disabling column filter
  - To customize **file upload** input, use the following fields:
    - `.meta({ uploadFile: async (fileObj)=> urlString })`
      - Boilerplate code for uploading your file. The UI automatically generate this.
    - `.meta({ accept: string })`
      - Used for input component. Example: '.jp'
    - `.meta({ uploadFileInit: ()=> null })`
      - Not required. Useful for logging to third party API.
    - `.meta({ multiple: true })`
      - If multiple, user can upload multiple file and joi type should be array. Otherwise user can only upload a single file and joi type can be array or string.
    - `.meta({ uploadFileType: 'image' | 'file' })`
      - If image, the table and the form would show preview of the given file.
  - To customize **heirarchical dropdown** input use the following fields:
    - `.meta({ cascaderOptions: [{node}] })`
      - Required for `<CascaderStatic>` type. Used to specify all possible options.
    - `.meta({ names: [str] | str })`
      - Required for `<CascaderStatic>` type. Used to specify related fields for each option.
      - If the type is array, all options are transfered to each fields.
      - If the type is string, only the rightmost choice is transfered to the specified field.
    - `.meta({ notFound: true })`
      - For `<CascaderStatic>` type. Allow users to specify choices not listed in options.
    - `.meta({ notFoundText: str })`
      - For `<CascaderStatic>` type. The text that would be shown when the given choices aren't listed in the options. It is also used when editing data and the initial data doesn't match options.
    - `.meta({ cascaderFetchData: async(selected)=> [{node}] })`
      - Required for `<CascaderAsync>` type. Used to fetch options from server.
    - Other props are forwarded to `<Cascader>` component from [Antd library](https://ant.design/components/cascader/#API).
  - **ETC**
    - `.valid([ any ])`
      - Required for `<Select>` type. Used to specify the options.
    - `.meta({ validLabel: [string] })`
      - For `<Select>` type. Used to specify label for each option. The array length must be equal to input of `.valid([ any ])`.
    - `.meta({ loadBarcodeName: async(barcode)=> string })`
      - Required for `<Barcode>` type. Used to fetch human-readable data of the barcode.

## AutoAdmin Props API

| Name                 | Description                                                                                                                                                          | Type                                                                | DefaultValue |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------ |
| schema               | specification on how the UI will render                                                                                                                              | {Joi Object}                                                        | `required`   |
| name                 | name of this data                                                                                                                                                    | string                                                              | `required`   |
| getMany              | the function connecting to back-end API. If `querySchema` is provided, query object will be derived from user input                                                  | async (query)=> [{rowData}]                                         | `required`   |
| createMany           | if not provided, the createButton will not show. The return value should be mostly the same as the argument except that it has primary key generated from the server | async ([formData])=> [rowData]                                      | null         |
| updateOne            | if not provided, the updateButton will not show                                                                                                                      | async (formData, rowData)=> null                                    | null         |
| deleteMany           | if not provided, the rows can't be selected                                                                                                                          | async ([formData])=> null                                           | null         |
| rowButtons           | custom buttons for each row                                                                                                                                          | [{onClick: (rowData)=> null,<br> icon: AntIcon,<br> label: string}] | []           |
| querySchema          | specification of query for getMany operation                                                                                                                         | {Joi Object}                                                        | null         |
| tableScroll          | viewport size for scrolling                                                                                                                                          | object                                                              | { y: 600 }   |
| disableExcelDownload | disable downloading all the data in this table to excel                                                                                                              | boolean                                                             | false        |
| disableExcelUpload   | Hide both the uploadButton and the uploadPreviewButton                                                                                                               | boolean                                                             | false        |
| uploadPreviewUrl     | if specified, the uploadPreviewButton will download file from this path instead of the first 3 rows of this table                                                    | string                                                              | null         |
| description          | description of this table, displayed under title                                                                                                                     | string                                                              | ''           |
| steps                | break form into multi steps using `<Steps>` component from antd.                                                                                                     | [string]                                                            | []           |
| largeComponent       | enlarge all antd components                                                                                                                                          | boolean                                                             | false        |
| devMode              | remove `required` from all fields for easy testing                                                                                                                   | boolean                                                             | false        |

## FormModal Props API

```jsx
import { Joi, openFormModal } from "joi-auto-admin";

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

const App = () => {
  const props = {
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
      <button onClick={onClick}>เปิดฟอร์ม</button>
    </center>
  );
};

export default App;
```

| Name           | Description                                                      | Type                                        | DefaultValue  |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------- | ------------- |
| schema         | specification on how the UI will render                          | {Joi Object} or<br> async ()=> {Joi Object} | `required`    |
| onSubmit       | form handler                                                     | async(formData)=>any                        | `required`    |
| title          | title of this form                                               | string                                      | "เพิ่มข้อมูล" |
| steps          | break form into multi steps using `<Steps>` component from antd. | [string]                                    | []            |
| largeComponent | enlarge all antd components                                      | boolean                                     | false         |
| devMode        | remove `required` from all fields for easy testing               | boolean                                     | false         |

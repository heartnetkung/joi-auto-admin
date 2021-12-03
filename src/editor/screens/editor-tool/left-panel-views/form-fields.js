import React, { useState } from "react";
import PropTypes from "prop-types";
import { PlusOutlined, DeleteFilled } from "@ant-design/icons";
import {
  Form,
  Button,
  Collapse,
  Select,
  Row,
  Col,
  Input,
  Checkbox,
  Divider,
  Typography,
} from "antd";
import _ from "lodash";
import {
  rowField,
  filedTypes,
  fieldOptions,
  columnOptions,
} from "./data-field";
import * as styles from "./styles";
import * as logic from "./logic";

const FormFields = (props) => {
  const { formState, setFormState } = props;
  const [dataFieldOptions] = useState(() => logic.createOptions(fieldOptions));
  const [dataColumnOptions] = useState(() =>
    logic.createOptions(columnOptions)
  );

  const onAddField = () => {
    if (!Array.isArray(formState)) {
      return;
    }
    const newForm = [...formState];
    newForm.push({ ...rowField });
    setFormState(newForm);
  };

  const onDeleteField = (index) => {
    if (!Array.isArray(formState)) {
      return;
    }
    if (!_.get(formState, "[1]")) {
      setFormState([{ ...rowField }]);
      return;
    }
    const newForm = [...formState];
    newForm.splice(index, 1);
    setFormState(newForm);
  };

  const onChangeField = (index, key, value) => {
    if (!Array.isArray(formState) || !key) {
      return;
    }
    let newForm = [...formState];
    if (!newForm[index] || !newForm[index]?.hasOwnProperty(key)) {
      return;
    }
    newForm[index][key] = value;
    if (key === "fieldType" && logic.checkIsDisabledDefault(value)) {
      newForm[index].defaultValue = "";
    }
    setFormState([...newForm]);
  };

  const onChangeConfig = (key, index, options) => {
    let newForm = [...formState];
    const data = key === "field" ? fieldOptions : columnOptions;
    const newOptionConfig = logic.createConfig(index, options, newForm, data);
    setFormState([...newOptionConfig]);
  };

  return (
    <Form>
      {_.get(formState, "[0]") && (
        <Collapse defaultActiveKey={["0"]}>
          {formState.map((item, index) => (
            <Collapse.Panel
              key={index.toString()}
              header={item.name}
              extra={
                <DeleteFilled
                  style={{ color: "red" }}
                  onClick={(event) => {
                    onDeleteField(index);
                    event.stopPropagation();
                  }}
                />
              }
            >
              <Row style={styles.rowInput}>
                <Col flex="1">
                  <Input
                    placeholder="name"
                    value={item.name}
                    onChange={(event) =>
                      onChangeField(index, "name", event.target.value)
                    }
                  />
                </Col>
                <Col span="1" />
                <Col flex="1">
                  <Input
                    placeholder="label"
                    value={item.label}
                    onChange={(event) =>
                      onChangeField(index, "label", event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Row style={styles.rowInput}>
                <Col flex="1">
                  <Row>
                    <Typography.Text style={{ padding: "0.25rem 0.5rem 0 0" }}>
                      FieldType
                    </Typography.Text>
                    {Array.isArray(filedTypes) && (
                      <Select
                        defaultValue={filedTypes[0]}
                        style={{ flex: 1 }}
                        onChange={(value) =>
                          onChangeField(index, "fieldType", value)
                        }
                      >
                        {filedTypes.map((ft, fi) => (
                          <Select.Option key={fi.toString()} value={ft}>
                            {ft}
                          </Select.Option>
                        ))}
                      </Select>
                    )}
                  </Row>
                </Col>
                <Col span="1" />
                <Col flex="1">
                  <Input
                    placeholder="defaultValue"
                    disabled={logic.checkIsDisabledDefault(item.fieldType)}
                    value={item.defaultValue}
                    onChange={(event) =>
                      onChangeField(index, "defaultValue", event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Row style={styles.rowInput}>
                <Col flex="1">
                  <Input
                    placeholder="placeholder"
                    value={item.placeholder}
                    onChange={(event) =>
                      onChangeField(index, "placeholder", event.target.value)
                    }
                  />
                </Col>
                <Col span="1" />
                <Col flex="1">
                  <Input
                    type="number"
                    min="0"
                    placeholder="step"
                    value={item.step}
                    onChange={(event) =>
                      onChangeField(index, "step", event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Checkbox.Group
                options={dataFieldOptions || []}
                onChange={(option) => onChangeConfig("field", index, option)}
              />
              <Divider type="horizontal" />
              <Row style={{ marginBottom: "1rem" }}>
                <Col span="12">
                  <Input
                    type="number"
                    placeholder="columnWidth"
                    value={item.columnWidth}
                    onChange={(event) =>
                      onChangeField(index, "columnWidth", event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Checkbox.Group
                options={dataColumnOptions || []}
                onChange={(option) => onChangeConfig("column", index, option)}
              />
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
      <Button
        block
        icon={<PlusOutlined />}
        style={styles.VerticalSpacer}
        onClick={onAddField}
      >
        New Field
      </Button>
    </Form>
  );
};

FormFields.propTypes = {
  formState: PropTypes.array.isRequired,
  setFormState: PropTypes.func.isRequired,
};

export default FormFields;

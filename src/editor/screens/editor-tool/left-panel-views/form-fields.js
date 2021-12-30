import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
  Cascader,
} from "antd";
import _ from "lodash";
import {
  fieldOptions,
  columnOptions,
  getSingleRow,
  placeholderDefault,
  fieldTree,
  disabledDefaultSet,
  disabledPlaceholderSet,
} from "./data-field";
import * as styles from "./styles";
import * as logic from "./logic";
import { UpOutlined, DownOutlined, DeleteOutlined } from "@ant-design/icons";

const FormFields = (props) => {
  const { formState, setFormState, settingState } = props;

  const [dataFieldOptions] = useState(() => logic.createOptions(fieldOptions));
  const [dataColumnOptions] = useState(() =>
    logic.createOptions(columnOptions)
  );

  useEffect(() => {
    if (_.get(settingState?.steps, "[0]")) {
      onSetDefaultStep();
    }
    var allInputs = document.querySelectorAll("input");
    for (var i = 0, ii = allInputs.length; i < ii; i++)
      allInputs[i].setAttribute("size", "1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settingState]);

  const onSetDefaultStep = () => {
    let newForm = [...formState];
    if (!Array.isArray(newForm)) {
      return;
    }
    newForm = newForm.map((item) => {
      const rowForm = { ...item };
      if (!rowForm.step) {
        rowForm.step = _.get(settingState.steps, "[0].value");
      }
      const isStepValueChanged =
        rowForm.step &&
        !settingState.steps.find((s) => s.value === rowForm.step);
      if (isStepValueChanged) {
        rowForm.step = _.get(settingState.steps, "[0].value");
      }
      return rowForm;
    });
    setFormState(newForm);
  };

  const onDeleteField = (index) => {
    if (!Array.isArray(formState)) {
      return;
    }
    if (!_.get(formState, "[1]")) {
      setFormState([{ ...getSingleRow(settingState?.steps) }]);
      return;
    }
    const newForm = [...formState];
    newForm.splice(index, 1);
    setFormState(newForm);
  };

  const onMoveUp = (index) => {
    if (!Array.isArray(formState) || index === 0) {
      return;
    }
    const newForm = [...formState];
    newForm.splice(index - 1, 2, formState[index], formState[index - 1]);
    setFormState(newForm);
  };

  const onMoveDown = (index) => {
    if (!Array.isArray(formState) || index === formState.length - 1) {
      return;
    }
    const newForm = [...formState];
    newForm.splice(index, 2, formState[index + 1], formState[index]);
    setFormState(newForm);
  };

  const onChangeField = (index, key, value) => {
    if (!Array.isArray(formState) || !key) {
      return;
    }
    let newForm = [...formState];
    if (!newForm[index]) {
      return;
    }
    newForm[index][key] = value;
    if (key === "fieldType" && disabledDefaultSet.has(value)) {
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
      {formState.length && (
        <Collapse defaultActiveKey={formState[0].name} accordion>
          {formState.map((item, index) => (
            <Collapse.Panel
              key={item.name}
              header={logic.getHeader(item)}
              extra={
                <>
                  <Button
                    icon={<UpOutlined style={styles.gray} />}
                    type="text"
                    onClick={(event) => {
                      onMoveUp(index);
                      event.stopPropagation();
                    }}
                  />
                  <Button
                    icon={<DownOutlined style={styles.gray} />}
                    type="text"
                    onClick={(event) => {
                      onMoveDown(index);
                      event.stopPropagation();
                    }}
                  />
                  <Button
                    icon={<DeleteOutlined style={styles.gray} />}
                    type="text"
                    onClick={(event) => {
                      onDeleteField(index);
                      event.stopPropagation();
                    }}
                  />
                </>
              }
            >
              <Row style={styles.rowInput}>
                <Col flex="90px">
                  <Typography.Text
                    style={{
                      height: 32,
                      lineHeight: "32px",
                    }}
                  >
                    FieldType
                  </Typography.Text>
                </Col>
                <Col flex="auto">
                  <Cascader
                    showSearch
                    allowClear={false}
                    fieldNames={{ label: "l", value: "l", children: "c" }}
                    options={fieldTree}
                    value={item._fieldType}
                    style={{ width: "100%" }}
                    dropdownRender={(a) => (
                      <div className="large-field-type">{a}</div>
                    )}
                    onChange={(value) => {
                      onChangeField(index, "_fieldType", value);
                      onChangeField(index, "fieldType", value.join("|"));
                    }}
                  />
                </Col>
              </Row>
              <Row style={styles.rowInput}>
                <Col flex="1">
                  <Input
                    placeholder="label"
                    value={item.label}
                    onChange={(event) =>
                      onChangeField(index, "label", event.target.value)
                    }
                  />
                </Col>
                <Col span="1" />
                <Col flex="1">
                  <Input
                    placeholder="name"
                    value={item.name}
                    onChange={(event) =>
                      onChangeField(index, "name", event.target.value)
                    }
                  />
                </Col>
              </Row>
              <Row style={styles.rowInput}>
                <Col flex="1">
                  <Input
                    placeholder="placeholder"
                    value={item.placeholder}
                    disabled={disabledPlaceholderSet.has(item.fieldType)}
                    onChange={(event) =>
                      onChangeField(index, "placeholder", event.target.value)
                    }
                  />
                </Col>
                <Col span="1" />
                <Col flex="1">
                  <Input
                    placeholder={
                      "defaultValue " +
                      (placeholderDefault[item.fieldType]
                        ? "ex. " + placeholderDefault[item.fieldType]
                        : "")
                    }
                    disabled={disabledDefaultSet.has(item.fieldType)}
                    value={item.defaultValue}
                    onChange={(event) =>
                      onChangeField(index, "defaultValue", event.target.value)
                    }
                  />
                </Col>
              </Row>
              {_.get(settingState?.steps, "[0]") && (
                <Row style={styles.rowInput}>
                  <Col flex="1">
                    <Row>
                      <Col flex="45px">
                        <Typography.Text
                          style={{
                            height: 32,
                            lineHeight: "32px",
                          }}
                        >
                          Step
                        </Typography.Text>
                      </Col>
                      <Col flex="auto">
                        <Select
                          defaultValue={
                            !_.isNil(item.step)
                              ? item.step
                              : settingState.steps[0].value
                          }
                          style={{ width: "100%" }}
                          value={item.step || settingState.steps[0].value}
                          onChange={(value) =>
                            onChangeField(index, "step", value)
                          }
                        >
                          {settingState.steps.map((st, si) => (
                            <Select.Option key={si.toString()} value={st.value}>
                              {st.value || `step ${si}`}
                            </Select.Option>
                          ))}
                        </Select>
                      </Col>
                    </Row>
                  </Col>
                  <Col span="1" />
                  <Col flex="1"></Col>
                </Row>
              )}
              <Checkbox.Group
                options={dataFieldOptions || []}
                onChange={(option) => onChangeConfig("field", index, option)}
                style={{ marginTop: 10 }}
              />
              <Divider type="horizontal" />
              <Row>
                <Col span="15">
                  <Checkbox.Group
                    options={dataColumnOptions || []}
                    onChange={(option) =>
                      onChangeConfig("column", index, option)
                    }
                    style={{ marginBottom: "1rem", lineHeight: "32px" }}
                  />
                </Col>
                <Col span="1" />
                <Col span="8">
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
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </Form>
  );
};

FormFields.propTypes = {
  formState: PropTypes.array.isRequired,
  setFormState: PropTypes.func.isRequired,
  settingState: PropTypes.object,
};

export default FormFields;

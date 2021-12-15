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
    <div>
      <Form>
        {_.get(formState, "[0]") && (
          <Collapse defaultActiveKey={["0"]} accordion>
            {formState.map((item, index) => (
              <Collapse.Panel
                key={item.name}
                header={logic.getHeader(item.name, item.step)}
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
                      <Typography.Text
                        style={{ padding: "0.25rem 0.5rem 0 0" }}
                      >
                        FieldType
                      </Typography.Text>
                      <Cascader
                        showSearch
                        allowClear={false}
                        fieldNames={{ label: "l", value: "l", children: "c" }}
                        options={fieldTree}
                        value={item._fieldType}
                        onChange={(value) => {
                          onChangeField(index, "_fieldType", value);
                          onChangeField(index, "fieldType", value.join("|"));
                        }}
                      />
                    </Row>
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
                      disabled={item.fieldType === "checkbox"}
                      onChange={(event) =>
                        onChangeField(index, "placeholder", event.target.value)
                      }
                    />
                  </Col>
                  <Col span="1" />
                  <Col flex="1">
                    {_.get(settingState?.steps, "[0]") && (
                      <Row>
                        <Typography.Text
                          style={{ padding: "0.25rem 0.5rem 0 0" }}
                        >
                          Step
                        </Typography.Text>
                        <Select
                          defaultValue={
                            !_.isNil(item.step)
                              ? item.step
                              : settingState.steps[0].value
                          }
                          style={{ flex: 1 }}
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
                      </Row>
                    )}
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
      </Form>
    </div>
  );
};

FormFields.propTypes = {
  formState: PropTypes.array.isRequired,
  setFormState: PropTypes.func.isRequired,
  settingState: PropTypes.object,
};

export default FormFields;

import React, { useState } from "react";
import PropTypes from "prop-types";
import lodash from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import {
  Input,
  Form,
  Checkbox,
  Collapse,
  Row,
  Col,
  Typography,
  Select,
  Divider,
  Button,
} from "antd";
import { SETTINGS } from "../constants";
import {
  filedTypes,
  getInitRowQuerySchema,
  getSingleRowQuerySchema,
} from "./data-field";
import * as styles from "./styles";
import * as logic from "./logic";

const RenderSetting = (props) => {
  const { settingState, setSettingState } = props;
  const [optionsStep] = useState(() => logic.createStepOptions());

  const cloneState = () => {
    const newSettings = { ...settingState };
    return newSettings;
  };

  const onChangeCheckbox = (type) => {
    const newSettings = cloneState();
    if (newSettings[type]) {
      delete newSettings[type];
    } else {
      newSettings[type] = true;
    }
    setSettingState(newSettings);
  };

  const onChangeField = (key, value) => {
    const newSettings = cloneState();
    newSettings[key] = value;
    if (key === "step") {
      onChangeSteps(newSettings, value);
      return;
    }
    setSettingState(newSettings);
  };

  const onChangeSteps = (state, numberOfStep) => {
    if (numberOfStep === "No step") {
      state.step = numberOfStep;
      state.steps = [];
    }
    const steps = [];
    for (let i = 1; i <= numberOfStep; i++) {
      steps.push({ placeholder: `label step ${i}`, value: `label step ${i}` });
    }
    state.steps = [...steps];
    setSettingState(state);
  };

  const onChangeInputSteps = (index, value) => {
    const newSettings = cloneState();
    newSettings.steps[index].value = value;
    setSettingState(newSettings);
  };

  const onChangCheckboxQuery = () => {
    const newSettings = cloneState();
    if (newSettings.querySchema.query) {
      newSettings.querySchema.schema = [...getInitRowQuerySchema()];
    }
    newSettings.querySchema.query = !newSettings.querySchema.query;
    setSettingState(newSettings);
  };

  const onChangeFieldQuerySchema = (index, key, value) => {
    if (!key) {
      return;
    }
    const newSettings = cloneState();
    if (!newSettings.querySchema.schema[index]) {
      return;
    }
    newSettings.querySchema.schema[index][key] = value;
    setSettingState(newSettings);
  };

  const onAddQuerySchema = () => {
    const newSettings = cloneState();
    newSettings.querySchema.schema = [
      ...newSettings.querySchema.schema,
      { ...getSingleRowQuerySchema() },
    ];
    setSettingState(newSettings);
  };

  const onDeleteQuerySchema = (index) => {
    const newSettings = cloneState();
    if (!lodash.get(newSettings.querySchema?.schema, "[1]")) {
      newSettings.querySchema.query = false;
      newSettings.querySchema.schema = [...getInitRowQuerySchema()];
    } else {
      newSettings.querySchema.schema.splice(index, 1);
    }
    setSettingState(newSettings);
  };
  // console.log(settingState, "set-u");
  return (
    <Form>
      <Typography.Title level={5}>Basic setup</Typography.Title>
      <Input
        style={styles.input}
        placeholder="name"
        value={settingState?.name}
        onChange={(event) => onChangeField("name", event.target.value)}
      />
      <Input
        style={styles.input}
        placeholder="description"
        value={settingState?.description}
        onChange={(event) => onChangeField("description", event.target.value)}
      />
      <div style={styles.layoutMargin}>
        {Array.isArray(SETTINGS) &&
          SETTINGS.map((item, index) => (
            <Checkbox
              key={index.toString()}
              style={{
                margin: index === 0 ? "0.2rem 0 0.5rem 0" : "0 0 0.5rem 0",
              }}
              checked={settingState[item]}
              onChange={() => onChangeCheckbox(item)}
            >
              {item}
            </Checkbox>
          ))}

        <div style={{ paddingTop: "1rem" }}>
          <Input
            style={styles.input}
            placeholder="uploadPreviewUrl"
            value={settingState?.uploadPreviewUrl}
            onChange={(event) =>
              onChangeField("uploadPreviewUrl", event.target.value)
            }
          />
        </div>
        <Divider />
        <div>
          <Typography.Title level={5}>Step setup</Typography.Title>
          <Row>
            <Typography.Text style={{ padding: "0.25rem 0.5rem 0 0" }}>
              Form Steps
            </Typography.Text>
            {Array.isArray(optionsStep) && (
              <Select
                defaultValue={settingState?.step || optionsStep[0].value}
                style={{ flex: 1 }}
                onChange={(value) => onChangeField("step", value)}
              >
                {optionsStep.map((st, si) => (
                  <Select.Option key={si.toString()} value={st.value}>
                    {st.label}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Row>
          <div style={{ paddingTop: "1rem" }}>
            {Array.isArray(settingState?.steps) &&
              settingState.steps.map((item, index) => (
                <Row key={index.toString()} style={{ padding: "0.5rem 0" }}>
                  <Col style={{ padding: "0.25rem 0.5rem 0 0", width: 65 }}>
                    <Typography.Text>{`step ${index + 1}`}</Typography.Text>
                  </Col>
                  <Col flex="1">
                    <Input
                      placeholder={item.placeholder}
                      value={item.value}
                      onChange={(event) =>
                        onChangeInputSteps(index, event.target.value)
                      }
                    />
                  </Col>
                </Row>
              ))}
          </div>
        </div>
        <Divider />
        <div>
          <Typography.Title level={5}>QuerySchema setup</Typography.Title>
          <Checkbox
            checked={settingState.querySchema?.query || false}
            onChange={() => onChangCheckboxQuery()}
          >
            with QuerySchema
          </Checkbox>
          {settingState.querySchema?.query && (
            <>
              <div style={{ padding: "1rem 0 0 0" }}>
                {lodash.get(settingState.querySchema?.schema, "[0]") && (
                  <Collapse defaultActiveKey={["0"]}>
                    {settingState.querySchema.schema.map((qs, qi) => (
                      <Collapse.Panel
                        key={qi.toString()}
                        header={qs.name}
                        extra={
                          <Button
                            type="dashed"
                            danger
                            onClick={(event) => {
                              onDeleteQuerySchema(qi);
                              event.stopPropagation();
                            }}
                          >
                            Delete
                          </Button>
                        }
                      >
                        <Row style={styles.rowInput}>
                          <Col flex="1">
                            <Input
                              placeholder="name"
                              value={qs.name}
                              onChange={(event) =>
                                onChangeFieldQuerySchema(
                                  qi,
                                  "name",
                                  event.target.value
                                )
                              }
                            />
                          </Col>
                          <Col span="1" />
                          <Col flex="1">
                            <Input
                              placeholder="label"
                              value={qs.label}
                              onChange={(event) =>
                                onChangeFieldQuerySchema(
                                  qi,
                                  "label",
                                  event.target.value
                                )
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
                              {Array.isArray(filedTypes) && (
                                <Select
                                  defaultValue={filedTypes[0]}
                                  style={{ flex: 1 }}
                                  onChange={(value) =>
                                    onChangeFieldQuerySchema(
                                      qi,
                                      "fieldType",
                                      value
                                    )
                                  }
                                >
                                  {filedTypes.map((ft, fi) => (
                                    <Select.Option
                                      key={fi.toString()}
                                      value={ft}
                                    >
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
                              placeholder="placeholder"
                              value={qs.placeholder}
                              onChange={(event) => {
                                onChangeFieldQuerySchema(
                                  qi,
                                  "placeholder",
                                  event.target.value
                                );
                              }}
                            />
                          </Col>
                        </Row>
                      </Collapse.Panel>
                    ))}
                  </Collapse>
                )}
              </div>
              <div>
                <Button
                  block
                  type="primary"
                  icon={<PlusOutlined />}
                  style={styles.VerticalSpacer}
                  onClick={onAddQuerySchema}
                >
                  Add Query
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Form>
  );
};

RenderSetting.propTypes = {
  formState: PropTypes.array.isRequired,
  setSettingState: PropTypes.func.isRequired,
};

export default RenderSetting;

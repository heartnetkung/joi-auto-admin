import React, { useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {
  PlusOutlined,
  QuestionCircleOutlined,
  UpOutlined,
  DownOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
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
  Tooltip,
} from "antd";
import { SETTINGS, SETTINGS2 } from "../constants";
import {
  queryFieldTree,
  getInitRowQuerySchema,
  getSingleRowQuerySchema,
  disabledPlaceholderSet,
} from "./data-field";
import * as styles from "./styles";
import * as logic from "./logic";
import ConditionalField from "./conditional_field";

const RenderSetting = (props) => {
  const { settingState, setSettingState } = props;
  const [optionsStep] = useState(() => logic.createStepOptions());

  const onChangeField = (key, value) => {
    const newSettings = { ...settingState };
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
    const newSettings = { ...settingState };
    newSettings.steps[index].value = value;
    setSettingState(newSettings);
  };

  const onChangeCheckboxQuery = () => {
    const newSettings = _.cloneDeep(settingState);
    if (newSettings.querySchema.query) {
      newSettings.querySchema.schema = [...getInitRowQuerySchema()];
    }
    newSettings.querySchema.query = !newSettings.querySchema.query;
    setSettingState(newSettings);
  };

  const onChangeConditionalField = () => {
    const newSettings = { ...settingState };
    newSettings.conditionalField = !settingState.conditionalField;
    setSettingState(newSettings);
  };

  const onChangeFieldQuerySchema = (index, key, value) => {
    if (!key) {
      return;
    }
    const newSettings = _.cloneDeep(settingState);
    if (!newSettings.querySchema.schema[index]) {
      return;
    }
    newSettings.querySchema.schema[index][key] = value;
    setSettingState(newSettings);
  };

  const onAddQuerySchema = () => {
    const newSettings = _.cloneDeep(settingState);
    newSettings.querySchema.schema = [
      ...newSettings.querySchema.schema,
      { ...getSingleRowQuerySchema() },
    ];
    setSettingState(newSettings);
  };

  const onDeleteQuerySchema = (index) => {
    const newSettings = _.cloneDeep(settingState);
    if (!_.get(newSettings.querySchema?.schema, "[1]")) {
      newSettings.querySchema.query = false;
      newSettings.querySchema.schema = [...getInitRowQuerySchema()];
    } else {
      newSettings.querySchema.schema.splice(index, 1);
    }
    setSettingState(newSettings);
  };

  const onMoveUp = (index) => {
    if (index === 0) return;
    const newSettings = _.cloneDeep(settingState);
    const { schema } = newSettings.querySchema;
    schema.splice(index - 1, 2, schema[index], schema[index - 1]);
    setSettingState(newSettings);
  };

  const onMoveDown = (index) => {
    if (index === settingState.querySchema.schema.length - 1) return;
    const newSettings = _.cloneDeep(settingState);
    const { schema } = newSettings.querySchema;
    schema.splice(index, 2, schema[index + 1], schema[index]);
    setSettingState(newSettings);
  };

  const makeCheckboxValue = (allChoices) =>
    _.chain(settingState)
      .pick(allChoices)
      .keys()
      .filter((a) => settingState[a])
      .value();

  const onCheckboxChange = (trueChoices, allChoices) => {
    var newState = { ...settingState };
    for (var allChoice of allChoices) delete newState[allChoice];
    for (var trueChoice of trueChoices) newState[trueChoice] = true;
    setSettingState(newState);
  };

  return (
    <Form>
      <Typography.Title level={5}>Table Settings</Typography.Title>
      <Input
        style={styles.input}
        placeholder="title"
        value={settingState?.title}
        onChange={(event) => onChangeField("title", event.target.value)}
      />
      <Input
        style={styles.input}
        placeholder="description"
        value={settingState?.description}
        onChange={(event) => onChangeField("description", event.target.value)}
      />
      <div style={styles.layoutMargin}>
        <Checkbox.Group
          style={{ marginBottom: 15, marginTop: 5 }}
          options={SETTINGS}
          value={makeCheckboxValue(SETTINGS)}
          onChange={(a) => onCheckboxChange(a, SETTINGS)}
        />
        <Checkbox.Group
          options={SETTINGS2}
          value={makeCheckboxValue(SETTINGS2)}
          onChange={(a) => onCheckboxChange(a, SETTINGS2)}
        />
        <Divider />
        <div>
          <Typography.Title level={5}>
            Multi-step Form
            <Tooltip
              overlayInnerStyle={{ width: 400 }}
              title='For complex form, you can divide your form into multiple steps. First, specify all the step names below. Then, go to "Fields" panel to assign each field to their respective step.'
            >
              <QuestionCircleOutlined
                style={{ marginLeft: 10, color: "#ccc" }}
              />
            </Tooltip>
          </Typography.Title>
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
          <Typography.Title level={5}>
            Conditional Fields
            <Tooltip
              overlayInnerStyle={{ width: 400 }}
              title="Some fields should be visible only when certain conditions are met. For example, the form may ask about the number of your children. This field should only show when your marriage status is 'married' or 'divorced' but not 'single'."
            >
              <QuestionCircleOutlined
                style={{ marginLeft: 10, color: "#ccc" }}
              />
            </Tooltip>
          </Typography.Title>
          <Checkbox
            checked={settingState.conditionalField || false}
            onChange={() => onChangeConditionalField()}
          >
            enable conditional fields
          </Checkbox>
          {settingState.conditionalField && <ConditionalField {...props} />}
        </div>
        <Divider />
        <div>
          <Typography.Title level={5}>
            Table Query
            <Tooltip
              overlayInnerStyle={{ width: 400 }}
              title="You can specify the query used for table data. First, design your UI below. Then, implement the query logic in 'getMany' function later on."
            >
              <QuestionCircleOutlined
                style={{ marginLeft: 10, color: "#ccc" }}
              />
            </Tooltip>
          </Typography.Title>
          <Checkbox
            checked={settingState.querySchema?.query || false}
            onChange={() => onChangeCheckboxQuery()}
          >
            enable table query
          </Checkbox>
          {settingState.querySchema?.query && (
            <>
              <div style={{ padding: "1rem 0 0 0" }}>
                {_.get(settingState.querySchema?.schema, "[0]") && (
                  <Collapse defaultActiveKey={["0"]} accordion>
                    {settingState.querySchema.schema.map((qs, qi) => (
                      <Collapse.Panel
                        key={qi.toString()}
                        header={logic.getHeader(qs)}
                        extra={
                          <>
                            <Button
                              icon={<UpOutlined style={styles.gray} />}
                              type="text"
                              onClick={(event) => {
                                onMoveUp(qi);
                                event.stopPropagation();
                              }}
                            />
                            <Button
                              icon={<DownOutlined style={styles.gray} />}
                              type="text"
                              onClick={(event) => {
                                onMoveDown(qi);
                                event.stopPropagation();
                              }}
                            />
                            <Button
                              icon={<DeleteOutlined style={styles.gray} />}
                              type="text"
                              onClick={(event) => {
                                onDeleteQuerySchema(qi);
                                event.stopPropagation();
                              }}
                            />
                          </>
                        }
                      >
                        <Row style={styles.rowInput}>
                          <Col flex="1">
                            <Row>
                              <Typography.Text
                                style={{ padding: "0.25rem 0.5rem 0 0" }}
                              >
                                FieldType
                              </Typography.Text>
                              <Select
                                defaultValue={queryFieldTree[0]}
                                value={qs.fieldType}
                                style={{ flex: 1 }}
                                onChange={(value) =>
                                  onChangeFieldQuerySchema(
                                    qi,
                                    "fieldType",
                                    value
                                  )
                                }
                                options={queryFieldTree}
                              />
                            </Row>
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
                              placeholder="placeholder"
                              value={qs.placeholder}
                              disabled={disabledPlaceholderSet.has(
                                qs.fieldType
                              )}
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

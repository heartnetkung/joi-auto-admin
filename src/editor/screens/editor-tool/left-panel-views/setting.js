import React, { useState } from "react";
import PropTypes from "prop-types";
import lodashGet from 'lodash/get';
import { Input, Form, Checkbox, Collapse, Row, Col, Typography, Select, Divider } from "antd";
import { SETTINGS } from "../constants";
import {
  filedTypes,
} from "./data-field";
import * as styles from "./styles";
import * as logic from "./logic";

const RenderSetting = (props) => {
  const { settingState, setSettingState } = props;
  const [optionsStep] = useState(() => logic.createStepOptions());

  const cloneState = () => {
    const newSettings = { ...settingState };
    return newSettings;
  }

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
    if (key === 'step') {
      onChangeSteps(newSettings, value);
      return;
    }
    setSettingState(newSettings);
  };

  const onChangQuerySchema = (key, value) => {
    const newSettings = cloneState();
    newSettings.querySchema[key] = value
    setSettingState(newSettings);
  }

  const onChangeSteps = (state, numberOfStep) => {
    if (numberOfStep === 'No step') {
      state.step = numberOfStep;
      state.steps = []
    }
    const steps = [];
    for (let i = 1; i <= numberOfStep; i++) {
      steps.push({ placeholder: `label step ${i}`, value: `step ${i}` })
    }
    state.steps = [...steps]
    setSettingState(state);
  }

  const onChangeInputSteps = (index, value) => {
    const newSettings = cloneState();
    newSettings.steps[index].value = value;
    setSettingState(newSettings);
  }

  return (
    <Form>
      <Typography.Title level={5}>
        Basic setup
      </Typography.Title>
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
        {Array.isArray(SETTINGS) && SETTINGS.map((item, index) =>
          <Checkbox
            key={index.toString()}
            style={{ margin: index === 0 ? '0.2rem 0 0.5rem 0' : '0 0 0.5rem 0' }}
            checked={settingState[item]}
            onChange={() => onChangeCheckbox(item)}
          >
            {item}
          </Checkbox>)}
        <Divider />
        <div>
          <Typography.Title level={5}>
            QuerySchema setup
          </Typography.Title>
          <Collapse defaultActiveKey={["0"]}>
            <Collapse.Panel key={"re-001"} header="querySchema">
              <Row style={styles.rowInput}>
                <Col flex="1">
                  <Input
                    placeholder="name"
                    value={settingState?.querySchema?.name}
                    onChange={(event) =>
                      onChangQuerySchema("name", event.target.value)
                    }
                  />
                </Col>
                <Col span="1" />
                <Col flex="1">
                  <Input
                    placeholder="label"
                    value={settingState?.querySchema?.label}
                    onChange={(event) =>
                      onChangQuerySchema("label", event.target.value)
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
                          onChangQuerySchema("fieldType", value)
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
                    placeholder="placeholder"
                    value={settingState?.querySchema?.placeholder}
                    onChange={(event) =>
                      onChangQuerySchema("placeholder", event.target.value)
                    }
                  />
                </Col>
              </Row>
            </Collapse.Panel>
          </Collapse>
        </div>
        <Divider />
        <div>
          <Typography.Title level={5}>
            Step setup
          </Typography.Title>
          <Row>
            <Typography.Text style={{ padding: "0.25rem 0.5rem 0 0" }}>
              Form Steps
            </Typography.Text>
            {
              Array.isArray(optionsStep) &&
              <Select defaultValue={settingState?.step || optionsStep[0].value}
                style={{ flex: 1 }}
                onChange={(value) =>
                  onChangeField("step", value)
                }>
                {optionsStep.map((st, si) => (
                  <Select.Option key={si.toString()} value={st.value}>
                    {st.label}
                  </Select.Option>
                ))}
              </Select>
            }
          </Row>
          <div style={{ paddingTop: '1rem' }}>
            {Array.isArray(settingState?.steps) &&
              settingState.steps.map((item, index) =>
                <div key={index.toString()} style={{ padding: '0.5rem 0' }}>
                  <Input

                    placeholder={item.placeholder}
                    value={item.value}
                    onChange={(event) =>
                      onChangeInputSteps(index, event.target.value)
                    }
                  />
                </div>
              )
            }
          </div>
          <div style={{ padding: '1rem 0' }}>
            {lodashGet(settingState, 'hasSteps', false) && <div>

            </div>}
          </div>
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

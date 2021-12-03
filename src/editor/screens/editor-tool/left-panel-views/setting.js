import React from "react";
import PropTypes from "prop-types";
import { Input, Form, Checkbox } from "antd";
import { SETTINGS } from "../constants";
import * as styles from "./styles";

const RenderSetting = (props) => {
  const { settingState, setSettingState } = props;

  const onChangeCheckbox = (type) => {
    const newSettings = { ...settingState };
    if (newSettings[type]) {
      delete newSettings[type];
    } else {
      newSettings[type] = true;
    }
    setSettingState(newSettings);
  };

  const onChangeField = (key, value) => {
    const newSettings = { ...settingState };
    newSettings[key] = value;
    setSettingState(newSettings);
  };

  return (
    <Form>
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
        <Checkbox
          checked={settingState[SETTINGS.canCreate]}
          onChange={() => onChangeCheckbox(SETTINGS.canCreate)}
        >
          {SETTINGS.canCreate}
        </Checkbox>
        <Checkbox
          style={styles.checkbox}
          checked={settingState[SETTINGS.canUpdate]}
          onChange={() => onChangeCheckbox(SETTINGS.canUpdate)}
        >
          {SETTINGS.canUpdate}
        </Checkbox>
        <Checkbox
          style={styles.checkbox}
          checked={settingState[SETTINGS.canDelete]}
          onChange={() => onChangeCheckbox(SETTINGS.canDelete)}
        >
          {SETTINGS.canDelete}
        </Checkbox>
        <Checkbox
          style={styles.checkbox}
          checked={settingState[SETTINGS.canDownloadExcel]}
          onChange={() => onChangeCheckbox(SETTINGS.canDownloadExcel)}
        >
          {SETTINGS.canDownloadExcel}
        </Checkbox>
        <Checkbox
          style={styles.checkbox}
          checked={settingState[SETTINGS.canUploadExcel]}
          onChange={() => onChangeCheckbox(SETTINGS.canUploadExcel)}
        >
          {SETTINGS.canUploadExcel}
        </Checkbox>
      </div>
    </Form>
  );
};

RenderSetting.propTypes = {
  formState: PropTypes.array.isRequired,
  setSettingState: PropTypes.func.isRequired,
};

export default RenderSetting;

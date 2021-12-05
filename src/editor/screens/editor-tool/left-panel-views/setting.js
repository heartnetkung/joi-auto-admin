import React, { useState } from "react";
import { Input, Form, Checkbox } from "antd";
import { SETTINGS } from "../constants";
import * as styles from "./styles";

const RenderSetting = () => {
  const [settingState, setSettingState] = useState({});

  const onChangeCheckbox = (type) => {
    const newSettings = { ...settingState };
    if (newSettings[type]) {
      delete newSettings[type];
    } else {
      newSettings[type] = true;
    }
    setSettingState(newSettings);
  };

  return (
    <Form>
      <Input style={styles.input} placeholder="name" />
      <Input style={styles.input} placeholder="description" />
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
        <Checkbox
          style={styles.checkbox}
          checked={settingState[SETTINGS.uploadPreviewUrl]}
          onChange={() => onChangeCheckbox(SETTINGS.uploadPreviewUrl)}
        >
          {SETTINGS.uploadPreviewUrl}
        </Checkbox>
      </div>
    </Form>
  );
};

RenderSetting.propTypes = {};

export default RenderSetting;

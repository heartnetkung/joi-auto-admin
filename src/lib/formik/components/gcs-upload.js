import React, { useState, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import PropTypes from "prop-types";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { alert } from "../../controller/util";
import { usePersistFn } from "../../shared/hook";
import _ from "lodash";

const GCSUpload = (props) => {
  const {
    name,
    label,
    multiple,
    accept,
    getUploadUrl,
    imagePreview,
    uploadFileType,
    requireImageSize,
  } = props;
  const [fileListState, setFileListState] = useState([]);
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (values && name) {
      const formKey = Object.keys(values).find((field) => field === name);
      if (!formKey) {
        setFileListState([]);
        setFieldValue((fieldValues) => delete fieldValues[name]);
      }
      if (
        formKey &&
        _.get(values[name], "[0]") &&
        !_.get(fileListState, "[0]")
      ) {
        const listAddName = values[name].map((elem) => ({
          ...elem,
          name: elem.url,
        }));
        setFileListState([...listAddName]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values, name]);

  const getImageSize = usePersistFn((file) => {
    const promise = new Promise((resolve, reject) => {
      let img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        resolve({ width, height });
      };
      img.onerror = () => {
        reject(new Error("can't get image size"));
      };
    });
    return promise;
  });

  const onEventUploadGetUrl = usePersistFn(async (options) => {
    const { onSuccess, onError, file } = options;

    if (typeof getUploadUrl !== "function" || !file) {
      return;
    }
    try {
      const uploadURL = await getUploadUrl(file.type);
      const headerConfig = {
        headers: { "Content-Type": file.type },
      };
      await axios.put(uploadURL, file, headerConfig);
      const url = new URL(uploadURL);
      const res = {
        status: 200,
        message: "ok",
        uri: url.origin + url.pathname,
        url: URL.createObjectURL(file),
      };
      if (uploadFileType === "image" && requireImageSize) {
        const { width, height } = await getImageSize(file);
        res.width = width;
        res.height = height;
      }
      onSuccess(res);
    } catch (error) {
      onError({
        message: error?.response || "Upload failed!",
      });
      alert.error("อัพโหลดไฟล์ไม่สำเร็จ");
    }
  });

  const onEventSetFormik = usePersistFn((newState) => {
    const listFile = newState.map((elem) => {
      const item = { url: elem.uri };
      if (uploadFileType !== "image") {
        return item;
      }
      if (item.width) {
        item.width = elem.width;
      }
      if (elem.height) {
        item.height = elem.height;
      }
      return item;
    });
    setFieldValue(name, [...listFile], false);
  });

  const onChangeFile = usePersistFn((info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(multiple ? 0 : -1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.uri = file.response.uri;
        file.url = file.response.url;
      }
      return file;
    });
    setFileListState(newFileList);
    onEventSetFormik(newFileList);
  });

  const renderHelper = usePersistFn(() => {
    return (
      <>
        <Upload
          name={name}
          listType={imagePreview ? "picture" : null}
          multiple={multiple}
          accept={accept}
          fileList={fileListState}
          onChange={onChangeFile}
          customRequest={onEventUploadGetUrl}
        >
          <Button icon={<UploadOutlined />}>{label}</Button>
        </Upload>
      </>
    );
  });

  return <FieldArray name={name} render={renderHelper} />;
};

GCSUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  getUploadUrl: PropTypes.func,
  imagePreview: PropTypes.bool,
  uploadFileType: PropTypes.oneOf(["image", "file"]).isRequired,
  requireImageSize: PropTypes.bool,
};

GCSUpload.defaultProps = {
  label: "อัพโหลดไฟล์",
  multiple: false,
  accept: "*",
  getUploadUrl: null,
  imagePreview: false,
  requireImageSize: false,
};

export default GCSUpload;

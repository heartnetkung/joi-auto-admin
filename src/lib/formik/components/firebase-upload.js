import React, { useState, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import PropTypes from "prop-types";
import probe from "probe-image-size";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { alert } from "../../controller/util";
import { usePersistFn } from "../../shared/hook";
import _ from "lodash";
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

let firebaseApp = null;
let firebaseStorage = null;

const FirebaseUpload = (props) => {
  const {
    name,
    label,
    multiple,
    accept,
    imagePreview,
    uploadFileType,
    isRequireImageSize,
    firebaseConfig,
  } = props;
  const [fileListState, setFileListState] = useState([]);
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    if (_.isObject(firebaseConfig) && !firebaseApp && !firebaseStorage) {
      firebaseApp = initializeApp(firebaseConfig);
      firebaseStorage = getStorage(firebaseApp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseApp, firebaseStorage, firebaseConfig]);

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

  console.log(firebaseStorage, "storage");

  const onEventUpload = usePersistFn(async (options) => {
    const { onSuccess, onError, file } = options;

    if (typeof getUploadUrl !== "function" || !file) {
      return;
    }
    try {
      const uploadURL = "https://www.google.com";
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
      if (uploadFileType === "image" && isRequireImageSize) {
        const { width, height } = await probe(res.uri);
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

  const onEventSetFormik = (newState) => {
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
  };

  const onChangeFile = usePersistFn((info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(multiple ? 0 : -1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.url = file.response.url;
        file.uri = file.response.uri;
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
          customRequest={onEventUpload}
        >
          <Button icon={<UploadOutlined />}>{label}</Button>
        </Upload>
      </>
    );
  });

  return <FieldArray name={name} render={renderHelper} />;
};

FirebaseUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  multiple: PropTypes.bool,
  accept: PropTypes.string,
  imagePreview: PropTypes.bool,
  uploadFileType: PropTypes.oneOf(["image", "file"]).isRequired,
  isRequireImageSize: PropTypes.bool,

  /* firebase storage keys */
  firebaseConfig: PropTypes.object.isRequired,
};

FirebaseUpload.defaultProps = {
  label: "อัพโหลดไฟล์",
  multiple: false,
  accept: "*",
  getUploadUrl: null,
  imagePreview: false,
  isRequireImageSize: false,
};

export default FirebaseUpload;

// "apiKey": "AIzaSyAXkEyUzjwZRfbOGtP9XkJcR4-E9ecoZWQ",
//   "authDomain": "jobfinfin-dev.firebaseapp.com",
//   "projectId": "jobfinfin-dev",
//   "storageBucket": "jobfinfin-dev.appspot.com",
//   "messagingSenderId": "646571522180",
//   "appId": "1:646571522180:web:f7f749a1a15985fc2c2ad1",
//   "measurementId": "G-KWZ5JHSJ58"

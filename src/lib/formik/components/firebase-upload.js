import React, { useState, useEffect } from "react";
import { FieldArray, useFormikContext } from "formik";
import PropTypes from "prop-types";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { alert } from "../../controller/util";
import { usePersistFn } from "../../shared/hook";
import _ from "lodash";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";

let firebaseApp = null;
let firebaseStorage = null;

const FirebaseUpload = (props) => {
  const {
    name,
    label,
    multiple,
    accept,
    uploadFileType,
    requireImageSize,
    firebaseConfig,
    collectionName,
    prefixFileName,
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
  }, [name]);

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

  const onEventUpload = usePersistFn(async (options) => {
    const { onSuccess, onError, file } = options;
    if (!file || !firebaseStorage) {
      return;
    }
    try {
      const fileName = prefixFileName
        ? `${prefixFileName}-${nanoid()}`
        : nanoid();
      const pathReference = collectionName
        ? `${collectionName}/${fileName}`
        : `defaultCollections/${fileName}`;
      const storageRef = ref(firebaseStorage, pathReference);
      await uploadBytes(storageRef, file);
      const uploadUrl = await getDownloadURL(storageRef);
      const res = {
        status: 200,
        message: "ok",
        uri: uploadUrl,
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
          listType={uploadFileType === "image" ? "picture" : null}
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
  uploadFileType: PropTypes.oneOf(["image", "file"]).isRequired,
  requireImageSize: PropTypes.bool,
  firebaseConfig: PropTypes.object.isRequired,
  collectionName: PropTypes.string,
  prefixFileName: PropTypes.string,
};

FirebaseUpload.defaultProps = {
  label: "อัพโหลดไฟล์",
  multiple: false,
  accept: "*",
  requireImageSize: false,
  collectionName: "",
  prefixFileName: "",
};

export default FirebaseUpload;

// Example firebaseConfig
// firebaseConfig: {
//   apiKey: "",
//   authDomain: "",
//   projectId: "",
//   storageBucket: "",
//   messagingSenderId: "",
//   appId: "",
//   measurementId: "",
// },

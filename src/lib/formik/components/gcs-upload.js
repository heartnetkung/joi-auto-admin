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

const cacheImageRef = React.createRef(null);

const GCSUpload = (props) => {
  const {
    name,
    label,
    multiple,
    accept,
    getUploadUrl,
    imagePreview,
    uploadFileType,
    isRequireImageSize,
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
        url: url.origin + url.pathname,
        renderUrl: URL.createObjectURL(file),
      };
      if (uploadFileType === "image" && isRequireImageSize) {
        const { width, height } = await probe(res.url);
        res.width = width;
        res.height = height;
      }
      onSuccess(res);
    } catch (error) {
      onError({
        message: error?.response || "Upload failed!",
      });
      console.log(error, "err-xx");
      alert.error("อัพโหลดไฟล์ไม่สำเร็จ");
    }
  });

  const onEventSetFormik = usePersistFn((newState) => {
    const listFile = newState.map((elem) => {
      const item = { url: elem.url, renderUrl: elem.renderUrl };
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

  const onEventSetCacheImage = usePersistFn((url, renderUrl) => {
    if (!url || !renderUrl) {
      return;
    }
    if (!_.isEmpty(cacheImageRef.current)) {
      cacheImageRef.current[url] = renderUrl;
    } else {
      cacheImageRef.current = {};
      cacheImageRef.current[url] = renderUrl;
    }
  });

  const onChangeFile = usePersistFn((info) => {
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(multiple ? 0 : -1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.renderUrl = file.response.renderUrl;
        file.url = file.response.url;
        onEventSetCacheImage(file.url, file.renderUrl);
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
  isRequireImageSize: PropTypes.bool,
};

GCSUpload.defaultProps = {
  label: "อัพโหลดไฟล์",
  multiple: false,
  accept: "*",
  getUploadUrl: null,
  imagePreview: false,
  isRequireImageSize: false,
};

export default GCSUpload;

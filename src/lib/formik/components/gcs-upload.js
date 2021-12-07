import React, { useState, useEffect, useRef } from "react";
import { FieldArray, useFormikContext } from "formik";
import PropTypes from "prop-types";
import { Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { alert } from "../../controller/util";
import { usePersistFn } from "../../shared/hook";
import _ from "lodash";

const GCSUpload = (props) => {
  const { name, label, multiple, accept, getUploadUrl, uploadFileType } = props;
  const { dataType } = props;
  const [fileListState, setFileListState] = useState([]);
  const { values, setFieldValue } = useFormikContext();
  const abortRef = useRef(null);
  if (abortRef.current === null) abortRef.current = new AbortController();

  useEffect(() => {
    let value = _.get(values, name);
    if (typeof value === "string") value = [value];
    if (Array.isArray(value)) setFileListState(value.map(urlToFileList));
    return () => abortRef.current.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  const onUpload = usePersistFn(async (options) => {
    const { onSuccess, onError, file } = options;
    if (!file) return;

    try {
      const uploadURL = await getUploadUrl(file.type, file.name);
      await axios.put(uploadURL, file, {
        headers: { "Content-Type": file.type },
        signal: abortRef.current.signal,
      });
      onSuccess({
        status: 200,
        uri: uploadURL.split(/[#?]/)[0],
        url: URL.createObjectURL(file),
      });
    } catch (error) {
      onError({});
      alert.error("อัพโหลดไฟล์ไม่สำเร็จ");
    }
  });

  const onChangeFile = usePersistFn((info) => {
    let newFileList = info.fileList.slice(multiple ? 0 : -1);
    newFileList = newFileList.map((file) => {
      if (file.response) {
        file.uri = file.response.uri;
        file.url = file.response.url;
      }
      return file;
    });
    setFileListState(newFileList);

    let listFile = newFileList.map((a) => a.uri).filter((a) => !!a);
    if (dataType === "string") listFile = listFile[0];
    setFieldValue(name, listFile, false);
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
          customRequest={onUpload}
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
  getUploadUrl: PropTypes.func.isRequired,
  uploadFileType: PropTypes.oneOf(["image", "file"]).isRequired,
  dataType: PropTypes.oneOf(["string", "array"]).isRequired,
};

GCSUpload.defaultProps = {
  label: "อัพโหลดไฟล์",
  multiple: false,
  accept: "*",
};

const urlToFileList = (a) => ({
  name: encodeURIComponent(a.split(/[#?]/)[0].split(/\//).pop()),
  url: a,
  uri: a,
});

export default GCSUpload;

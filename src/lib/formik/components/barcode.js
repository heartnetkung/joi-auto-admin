import PropTypes from "prop-types";
import { Input as FInput } from "formik-antd";
import _ from "lodash";
import React, { useState, useEffect } from "react";
import { Typography, Divider, Col, Row, Button, Input } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { usePersistFn } from "../../shared/hook";
import { useFormikContext } from "formik";

const OMIT_FIELDS = ["loadBarcodeName"];
const { Text } = Typography;

const Barcode = (props) => {
  const { loadBarcodeName, name } = props;
  const { values, setFieldValue } = useFormikContext();

  const [inputValue, setInputValue] = useState("");
  const barcodes = _.get(values, name) || [];
  const itemNames = _.get(values, "$" + name);

  useEffect(() => {
    (async () => {
      try {
        var queue = barcodes.map((a) => loadBarcodeName(a));
        var results = await Promise.all(queue);
        var newItemNames = {};
        for (var i = 0, ii = queue.length; i < ii; i++)
          newItemNames[barcodes[i]] = results[i] || "ไม่พบข้อมูล";
        setFieldValue("$" + name, newItemNames, false);
      } catch (e) {}
    })();
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  const onKeyDown = usePersistFn(async (event) => {
    if (event.key !== "Enter") return;
    setFieldValue(name, [...barcodes, inputValue], false);
    setInputValue("");
    event.preventDefault();
    if (itemNames?.[inputValue]) return;

    var temp;
    try {
      var newName = await loadBarcodeName(inputValue);
      temp = { ...itemNames, [inputValue]: newName || "ไม่พบข้อมูล" };
      setFieldValue("$" + name, temp, false);
    } catch (e) {
      temp = { ...itemNames, [inputValue]: "ไม่พบข้อมูล" };
      setFieldValue("$" + name, temp, false);
    }
  });

  const remove = (index) => {
    var newValue = _.filter(barcodes, (a, i) => i !== index);
    setFieldValue(name, newValue, false);
  };

  return (
    <>
      <Input
        {..._.omit(props, OMIT_FIELDS)}
        onKeyDown={onKeyDown}
        validator={null}
        name={null}
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <Divider />
      {barcodes.map((a, i) => (
        <BarcodeLine
          key={i + ""}
          name={name + `[${i}]`}
          itemName={itemNames?.[a]}
          onClick={() => remove(i)}
        />
      ))}
    </>
  );
};

Barcode.propTypes = {
  loadBarcodeName: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

const BarcodeLine = (props) => {
  const { name, itemName, onClick } = props;

  return (
    <>
      <Row>
        <Col span={8}>
          <FInput
            disabled={true}
            size="small"
            style={{ marginBottom: 5 }}
            name={name}
          />
        </Col>
        <Col span={16}>
          <Button
            icon={<CloseOutlined />}
            size="small"
            shape="circle"
            style={{ marginLeft: 20 }}
            onClick={onClick}
          />
          <Text style={{ marginLeft: 20 }}>{itemName}</Text>
        </Col>
      </Row>
    </>
  );
};

export default Barcode;

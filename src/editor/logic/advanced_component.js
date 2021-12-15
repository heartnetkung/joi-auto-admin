import _ from "lodash";
import { Input } from "formik-antd";
import React, { useEffect } from "react";
import { useFormikContext } from "formik";

export const ReactiveComponent = (props) => {
	const { values, setFieldValue } = useFormikContext();
	const values2 = JSON.stringify(_.set({ ...values }, props.name, null));
	useEffect(() => {
		setFieldValue(props.name, values2, false);
		/* eslint-disable react-hooks/exhaustive-deps */
	}, [values2, props.name]);
	return <Input disabled {...props} />;
};

ReactiveComponent.str = `(props)=>{
const {values,setFieldValue} = useFormikContext();
const values2 = JSON.stringify(_.set({ ...values }, props.name, null));
useEffect(()=>{
// you can also use setFieldValue to mutate other fields
setFieldValue(props.name,values2,false);},[values2,props.name])
return <Input disabled {...props}/>;
}`;

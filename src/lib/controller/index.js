import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Table from "../table";
import { alert, appendId } from "./util";
import { useModal, useAPI, usePersistFn } from "../shared/hook";
import EditModal from "./edit_modal";
import Header from "./header";
import { JoiWrapper } from "../joi/joi_wrapper";
import { tableToExcel, excelToTable } from "../shared/xlsx";
import { deserializeTable, serializeTable } from "../joi/serialize2";
import ExcelErrorModal from "./excel_error_modal";
import Form from "../formik/form";
import Joi from "joi/lib/index";
import React from "react";
import _ from "lodash";

const INITIAL_FORM_STATUS = { isEdit: false, initialValue: null, error: null };

const Controller = (props) => {
	const { getMany, createMany, updateOne, deleteMany, devMode } = props;
	const { title, description, uploadPreviewUrl, disableSuccessModal } = props;
	const { schema, querySchema, rowButtons, tableScroll, steps } = props;
	const { disableExcelDownload, disableExcelUpload, tableButtons } = props;

	const [editModalData, setEditModalData] = useState(INITIAL_FORM_STATUS);
	const [excelError, setExcelError] = useState([]);
	const [getManyStatus, doGetMany, setData] = useAPI(getMany, true, true);
	const [deleteStatus, doDelete] = useAPI(deleteMany);
	const editModalControl = useModal();
	const excelModalControl = useModal();
	const schema2 = useMemo(() => new JoiWrapper(schema, devMode), [
		schema,
		devMode,
	]);
	const querySchema2 = useMemo(
		() => querySchema && new JoiWrapper(querySchema, devMode),
		[querySchema, devMode]
	);

	const onCreate = usePersistFn(() => {
		setEditModalData(INITIAL_FORM_STATUS);
		editModalControl.setVisible(true);
	});

	const onEdit = usePersistFn((obj) => {
		setEditModalData({ isEdit: true, initialValue: obj, error: null });
		editModalControl.setVisible(true);
	});

	const updateDataAtRow = usePersistFn((rowData) => {
		var tableData = getManyStatus.data;
		if (!Array.isArray(rowData)) rowData = [rowData];
		var ids = _.keyBy(rowData,'_id');
    	setData(tableData.map((a,i) => (ids[a._id] || a)));
	});

	const onSubmit = usePersistFn(async (data, actions, originalData) => {
		setEditModalData((a) => ({ ...a, error: null }));
		try {
			data = Joi.attempt(data, schema2.joiObj);
			schema2.formSpec
				.map((a) => a.name)
				.filter((a) => /^\$|\.\$/.test(a))
				.forEach((a) => _.unset(data, a));

			if (editModalData.isEdit) {
				await updateOne(data, originalData);
				updateDataAtRow(originalData);
				if (!disableSuccessModal) alert.success("แก้ไขข้อมูลเรียบร้อย");
				editModalControl.setVisible(false);
			} else {
				var returnData = await createMany([data]);
				if (!Array.isArray(returnData) || returnData.length !== 1)
					return alert.error("ข้อมูลจากเซิฟเวอร์ไม่ถูกต้อง");
				data = appendId(returnData[0]);
				setData([data, ...getManyStatus.data]);
				if (!disableSuccessModal) alert.success("สร้างข้อมูลเรียบร้อย");
				editModalControl.setVisible(false);
			}
		} catch (e) {
			setEditModalData((a) => ({ ...a, error: e }));
			actions.setSubmitting(false);
		}
	});

	const onDelete = usePersistFn(async (selectedKeys) => {
		try {
			var { data } = getManyStatus;
			var selectedSet = new Set(selectedKeys);
			var values = data.filter((a) => selectedSet.has(a._id));
			await doDelete(values);
			setData(data.filter((a) => !selectedSet.has(a._id)));
		} catch (e) {
			alert.error(e);
		}
	});

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		doGetMany({})
			.then((data) => setData(data.map(appendId)))
			.catch((error) => alert.error(error));
	}, [schema]);

	const onQuery = usePersistFn(async (query) => {
		try {
			query = Joi.attempt(query, querySchema2.joiObj);
			var data = await doGetMany(query);
			setData(data.map(appendId));
		} catch (e) {
			alert.error(e);
		}
	});

	const onDownloadExcel = usePersistFn(() => {
		if (!getManyStatus.data) return;
		var table = serializeTable(getManyStatus.data, schema2, true);
		tableToExcel(table, "export.xlsx");
	});
	const onExampleExcel = usePersistFn(() => {
		if (uploadPreviewUrl)
			return window.open(uploadPreviewUrl, "_blank").focus();
		if (!getManyStatus.data) return;
		var table = serializeTable(getManyStatus.data.slice(0, 3), schema2);
		tableToExcel(table, "example.xlsx");
	});
	const onUploadExcel = usePersistFn(async (a) => {
		try {
			var rawExcel = await excelToTable(a);
			var newRows = deserializeTable(rawExcel, schema2);
			var newData = await createMany(newRows, newRows);
			if (!Array.isArray(newData) || newData.length !== newRows.length)
				return alert.error("ข้อมูลจากเซิฟเวอร์ไม่ถูกต้อง");

			setData([...newData.map(appendId), ...getManyStatus.data]);
			if (!disableSuccessModal) alert.success("อัพโหลดเรียบร้อย");
		} catch (e) {
			if (e.name !== "SerializeError") return alert.error(e);
			setExcelError(e.errors);
			excelModalControl.setVisible(true);
		}
	});

	return (
		<>
			<Header title={title} description={description} />
			{querySchema && (
				<Form
					schema={querySchema2}
					onSubmit={onQuery}
					submitButtonLabel="ดึงข้อมูล"
					inline
				/>
			)}
			<Table
				{...getManyStatus}
				loading={getManyStatus.loading || deleteStatus.loading}
				schema={schema2}
				querySchema={querySchema}
				rowButtons={rowButtons}
				onEdit={updateOne && onEdit}
				onCreate={createMany && onCreate}
				onDelete={deleteMany && onDelete}
				onDownloadExcel={
					!disableExcelDownload && getManyStatus.data?.length
						? onDownloadExcel
						: null
				}
				onUploadExcel={
					!disableExcelUpload && createMany ? onUploadExcel : null
				}
				onExampleExcel={
					!disableExcelUpload &&
					createMany &&
					(uploadPreviewUrl || getManyStatus.data?.length)
						? onExampleExcel
						: null
				}
				tableScroll={tableScroll}
				updateDataAtRow={updateDataAtRow}
				tableButtons={tableButtons}
			/>
			<EditModal
				{...editModalControl}
				{...editModalData}
				schema={schema2}
				onSubmit={onSubmit}
				steps={steps}
			/>
			<ExcelErrorModal {...excelModalControl} errors={excelError} />
		</>
	);
};

Controller.propTypes = {
	// API
	getMany: PropTypes.func.isRequired,
	createMany: PropTypes.func,
	updateOne: PropTypes.func,
	deleteMany: PropTypes.func,

	// modifier
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	tableScroll: PropTypes.object,
	rowButtons: PropTypes.array,
	tableButtons: PropTypes.array,
	disableSuccessModal: PropTypes.bool,

	// form
	schema: PropTypes.object.isRequired,
	querySchema: PropTypes.object,
	steps: PropTypes.array,
	devMode: PropTypes.bool,

	//excel
	disableExcelDownload: PropTypes.bool,
	disableExcelUpload: PropTypes.bool,
	uploadPreviewUrl: PropTypes.string,
};

Controller.defaultProps = {
	getOne: null,
	createMany: null,
	updateOne: null,
	deleteMany: null,
	description: "",
	tableScroll: undefined,
	rowButtons: [],
	tableButtons: [],
	querySchema: null,
	disableExcelDownload: false,
	disableExcelUpload: false,
	uploadPreviewUrl: null,
	steps: [],
	devMode: false,
	disableSuccessModal: false,
};

export default Controller;

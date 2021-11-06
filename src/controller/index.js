import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Table from "../table";
import { useModal, useAPI, alert, usePersistFn, appendId } from "./util";
import EditModal from "./edit_modal";
import Header from "./header";
import { JoiWrapper } from "../joi/joi_wrapper";
import { tableToExcel, excelToTable } from "../facade/xlsx";
import { deserializeTable, serializeTable } from "../joi/serialize";
import ExcelErrorModal from "./excel_error_modal";

const INITIAL_FORM_STATUS = { isEdit: false, initialValue: {} };

const Controller = (props) => {
	const { getMany, createMany, updateOne, deleteMany } = props;
	const { canExportCsv, canImportCsv, name, description } = props;
	const { schema, querySchema, rowMenus } = props;
	const { canDownloadExcel, canUploadExcel, uploadPreviewUrl } = props;

	const [editModalData, setEditModalData] = useState(INITIAL_FORM_STATUS);
	const [excelError, setExcelError] = useState([]);
	const [getManyStatus, doGetMany, setData] = useAPI(getMany, true, true);
	const [createStatus, doCreate] = useAPI(createMany);
	const [updateStatus, doUpdate] = useAPI(updateOne);
	const [deleteStatus, doDelete] = useAPI(deleteMany);
	const editModalControl = useModal();
	const excelModalControl = useModal();

	const onCreate = usePersistFn(() => {
		setEditModalData(INITIAL_FORM_STATUS);
		editModalControl.setVisible(true);
	});

	const onEdit = usePersistFn((obj) => {
		setEditModalData({ isEdit: true, initialValue: obj });
		editModalControl.setVisible(true);
	});

	const onSubmit = usePersistFn(async (data) => {
		if (editModalData.isEdit) {
			await doUpdate(data);
			var tableData = getManyStatus.data;
			setData(tableData.map((a) => (a._id === data._id ? data : a)));
			alert.success("แก้ไขข้อมูลเรียบร้อย");
		} else {
			await doCreate([data]);
			data = appendId(data);
			setData([data, ...getManyStatus.data]);
			alert.success("สร้างข้อมูลเรียบร้อย");
		}
		editModalControl.setVisible(false);
	});

	const onDelete = usePersistFn(async (selectedKeys) => {
		var selectedSet = new Set(selectedKeys);
		var values = getManyStatus.data.filter((a) => selectedSet.has(a._id));
		var [error] = await doDelete(values);
		if (error) return alert.error(error);
		setData(getManyStatus.data.filter((a) => !selectedSet.has(a._id)));
	});

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		doGetMany().then(([error, data]) => {
			if (error) return alert.error(error);
			setData(data.map(appendId));
		});
	}, []);

	const schema2 = useMemo(() => new JoiWrapper(schema), [schema]);

	const onDownloadExcel = usePersistFn(() => {
		if (!getManyStatus.data) return;
		var table = serializeTable(getManyStatus.data, schema2);
		tableToExcel(table, "export.xlsx");
	});
	const onExampleExcel = usePersistFn(() => {
		if (!getManyStatus.data) return;
		var table = serializeTable(getManyStatus.data.slice(0, 3), schema2);
		tableToExcel(table, "example.xlsx");
	});
	const onUploadExcel = usePersistFn(async (a) => {
		try {
			var rawExcel = await excelToTable(a);
			var newRows = deserializeTable(rawExcel, schema2);
			await doCreate(newRows);
			setData([...newRows.map(appendId), ...getManyStatus.data]);
			alert.success("อัพโหลดเรียบร้อย");
		} catch (e) {
			if (e.name !== "SerializeError") return alert.error(e);
			setExcelError(e.errors);
			excelModalControl.setVisible(true);
		}
	});

	return (
		<>
			<Header name={name} />
			<Table
				{...getManyStatus}
				loading={getManyStatus.loading || deleteStatus.loading}
				canExportCsv={canExportCsv}
				canImportCsv={canImportCsv}
				schema={schema2}
				querySchema={querySchema}
				rowMenus={rowMenus}
				description={description}
				onEdit={updateOne && onEdit}
				onCreate={createMany && onCreate}
				onDelete={deleteMany && onDelete}
				data={getManyStatus.data}
				onDownloadExcel={canDownloadExcel ? onDownloadExcel : null}
				onUploadExcel={canUploadExcel ? onUploadExcel : null}
				onExampleExcel={canUploadExcel ? onExampleExcel : null}
			/>
			<EditModal
				{...editModalControl}
				{...editModalData}
				schema={schema2}
				onSubmit={onSubmit}
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
	name: PropTypes.string.isRequired,
	description: PropTypes.string,

	// form
	schema: PropTypes.object.isRequired,
	querySchema: PropTypes.object,
	rowMenus: PropTypes.array,

	//excel
	canDownloadExcel: PropTypes.bool,
	canUploadExcel: PropTypes.bool,
	uploadPreviewUrl: PropTypes.string,
};

Controller.defaultProps = {
	getOne: null,
	createMany: null,
	updateOne: null,
	deleteMany: null,
	description: "",
	rowMenus: [],
	querySchema: null,
	canDownloadExcel: true,
	canUploadExcel: true,
	uploadPreviewUrl: null,
};

export default Controller;

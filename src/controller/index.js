import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";
import Table from "../table";
import {
	useModal,
	useAPI,
	modalSuccess,
	modalError,
	usePersistFn,
	appendId,
} from "./util";
import EditModal from "./edit_modal";
import Header from "./header";
import { JoiWrapper } from "../joi/joi_wrapper";

const INITIAL_FORM_STATUS = { isEdit: false, initialValue: {} };

const Controller = (props) => {
	const { getMany, createMany, updateOne, deleteMany } = props;
	const { canExportCsv, canImportCsv, name, description } = props;
	const { schema, querySchema, actions } = props;

	const [editModalData, setEditModalData] = useState(INITIAL_FORM_STATUS);
	const [getManyStatus, doGetMany, setData] = useAPI(getMany, true, true);
	const [createStatus, doCreate] = useAPI(createMany);
	const [updateStatus, doUpdate] = useAPI(updateOne);
	const [deleteStatus, doDelete] = useAPI(deleteMany);
	const editModalControl = useModal();

	const onCreate = usePersistFn(() => {
		setEditModalData(INITIAL_FORM_STATUS);
		editModalControl.setVisible(true);
	});

	const onEdit = usePersistFn((obj) => {
		setEditModalData({ isEdit: true, initialValue: obj });
		editModalControl.setVisible(true);
	});

	const onSubmit = usePersistFn(async (data, actions) => {
		if (editModalData.isEdit) {
			await doUpdate(data);
			var tableData = getManyStatus.data;
			setData(tableData.map((a) => (a._id === data._id ? data : a)));
			modalSuccess("แก้ไขข้อมูลเรียบร้อย");
		} else {
			await doCreate([data]);
			data = appendId(data);
			setData([data, ...getManyStatus.data]);
			modalSuccess("สร้างข้อมูลเรียบร้อย");
		}
		editModalControl.setVisible(false);
	});

	const onDelete = usePersistFn(async (selectedKeys) => {
		var selectedSet = new Set(selectedKeys);
		var values = getManyStatus.data.filter((a) => selectedSet.has(a._id));
		var [error] = await doDelete(values);
		if (error) return modalError(error);
		setData(getManyStatus.data.filter((a) => !selectedSet.has(a._id)));
	});

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		doGetMany().then(([error, data]) => {
			if (error) return modalError(error);
			setData(data.map(appendId));
		});
	}, []);

	const schema2 = useMemo(() => new JoiWrapper(schema), [schema]);

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
				actions={actions}
				description={description}
				onEdit={updateOne && onEdit}
				onCreate={createMany && onCreate}
				onDelete={deleteMany && onDelete}
				data={getManyStatus.data}
			/>
			<EditModal
				{...editModalControl}
				{...editModalData}
				schema={schema2}
				onSubmit={onSubmit}
			/>
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
	canExportCsv: PropTypes.bool,
	canImportCsv: PropTypes.bool,
	name: PropTypes.string.isRequired,
	description: PropTypes.string,

	// form
	schema: PropTypes.object.isRequired,
	querySchema: PropTypes.object,
	actions: PropTypes.array,
};

Controller.defaultProps = {
	getOne: null,
	createMany: null,
	updateOne: null,
	deleteMany: null,
	canExportCsv: true,
	canImportCsv: true,
	description: "",
	actions: [],
	querySchema: null,
};

export default Controller;

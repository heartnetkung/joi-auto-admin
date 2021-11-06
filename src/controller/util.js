import { useState, useRef } from "react";
import { Modal } from "antd";
import { nanoid } from "nanoid";

export const alert = {
	success: (content) => Modal.success({ content }),
	error: (e) => Modal.error({ content: e.message || e + "" }),
};

export const useAPI = (func, loadingInit, manualComplete) => {
	const [apiState, setApiState] = useState({
		loading: !!loadingInit,
		data: null,
		error: null,
	});
	const setData = (data) =>
		setApiState({ loading: false, data, error: null });

	const doRun = async function (a, b) {
		setApiState((a) => ({ loading: true, data: a.data, error: null }));
		try {
			var data = await func.apply(null, arguments);
			if (!manualComplete) setData(data);
			return [null, data];
		} catch (e) {
			setApiState((a) => ({ loading: false, data: null, error: e }));
			return [e, null];
		}
	};

	return [apiState, doRun, setData];
};

export const useModal = () => {
	const [visible, setVisible] = useState(false);
	const onClose = () => setVisible(false);
	return { visible, onClose, setVisible };
};

export const usePersistFn = (fn) => {
	const fnRef = useRef(fn);
	fnRef.current = fn;

	const persistFn = useRef();
	if (!persistFn.current)
		persistFn.current = function (...args) {
			return fnRef.current.apply(this, args);
		};

	return persistFn.current;
};

export const appendId = (a) => {
	if (a._id === undefined) return { ...a, _id: nanoid() };
	return a;
};

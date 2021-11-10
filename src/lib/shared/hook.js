import { useState, useRef, useEffect } from "react";

export const useAPI = (func, loadingInit, manualComplete) => {
	const [apiState, setApiState] = useState({
		loading: !!loadingInit,
		data: null,
	});
	const setData = (data) => setApiState({ loading: false, data });

	const doRun = async function (a, b) {
		setApiState((a) => ({ loading: true, data: a.data }));
		try {
			var data = await func.apply(null, arguments);
			if (!manualComplete) setData(data);
			return data;
		} catch (e) {
			setApiState((a) => ({ loading: false, data: null }));
			throw e;
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

export const useMaxWidth = (width) => {
	const [isMatch, setMatch] = useState(window.innerWidth <= width);
	const listener = (a) => setMatch(a.matches);
	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		var mediaQuery = window.matchMedia(`(max-width: ${width}px)`);
		mediaQuery.addListener(listener);
		return () => mediaQuery.removeListener(listener);
	}, []);
	return isMatch;
};

import { Modal } from "antd";
import { nanoid } from "nanoid";

export const alert = {
	success: (content) => Modal.success({ content }),
	error: (e) => Modal.error({ content: e.message || e + "" }),
};

export const appendId = (a) => {
	if (a._id === undefined) return { ...a, _id: nanoid() };
	return a;
};

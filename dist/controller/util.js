import _extends from "@babel/runtime/helpers/extends";
import { Modal } from "antd";
import { nanoid } from "nanoid";
export var alert = {
  success: function success(content) {
    return Modal.success({
      content: content
    });
  },
  error: function error(e) {
    return Modal.error({
      content: e.message || e + ""
    });
  }
};
export var appendId = function appendId(a) {
  if (a._id === undefined) return _extends({}, a, {
    _id: nanoid()
  });
  return a;
};
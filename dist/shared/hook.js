import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _regeneratorRuntime from "@babel/runtime/regenerator";
import { useState, useRef, useEffect } from "react";
export var useAPI = function useAPI(func, loadingInit, manualComplete) {
  var _useState = useState({
    loading: !!loadingInit,
    data: null
  }),
      apiState = _useState[0],
      setApiState = _useState[1];

  var setData = function setData(data) {
    return setApiState({
      loading: false,
      data: data
    });
  };

  var doRun = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(a, b) {
      var data,
          _args = arguments;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              setApiState(function (a) {
                return {
                  loading: true,
                  data: a.data
                };
              });
              _context.prev = 1;
              _context.next = 4;
              return func.apply(null, _args);

            case 4:
              data = _context.sent;
              if (!manualComplete) setData(data);
              return _context.abrupt("return", data);

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](1);
              setApiState(function (a) {
                return {
                  loading: false,
                  data: null
                };
              });
              throw _context.t0;

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[1, 9]]);
    }));

    return function doRun(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  return [apiState, doRun, setData];
};
export var useModal = function useModal() {
  var _useState2 = useState(false),
      visible = _useState2[0],
      setVisible = _useState2[1];

  var onClose = function onClose() {
    return setVisible(false);
  };

  return {
    visible: visible,
    onClose: onClose,
    setVisible: setVisible
  };
};
export var usePersistFn = function usePersistFn(fn) {
  var fnRef = useRef(fn);
  fnRef.current = fn;
  var persistFn = useRef();
  if (!persistFn.current) persistFn.current = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return fnRef.current.apply(this, args);
  };
  return persistFn.current;
};
export var useMaxWidth = function useMaxWidth(width) {
  var _useState3 = useState(window.innerWidth <= width),
      isMatch = _useState3[0],
      setMatch = _useState3[1];

  var listener = function listener(a) {
    return setMatch(a.matches);
  };
  /* eslint-disable react-hooks/exhaustive-deps */


  useEffect(function () {
    var mediaQuery = window.matchMedia("(max-width: " + width + "px)");
    mediaQuery.addListener(listener);
    return function () {
      return mediaQuery.removeListener(listener);
    };
  }, []);
  return isMatch;
};
import _extends from "@babel/runtime/helpers/extends";

function _createForOfIteratorHelperLoose(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (it) return (it = it.call(o)).next.bind(it); if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; return function () { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

import _ from "lodash";
export var calculateSpan = function calculateSpan(formSpec, isInline) {
  if (isInline) return formSpec.map(function (a) {
    return _extends({}, a, {
      colSpan: 6
    });
  });
  var ans = [];
  var isPreviousLeft = false;

  for (var i = 0, ii = formSpec.length; i < ii; i++) {
    var current = formSpec[i];

    if (!current.twoColumn) {
      ans.push(current);
      isPreviousLeft = false;
    } else if (isPreviousLeft === false) {
      var _formSpec;

      //left
      var hasNext = (_formSpec = formSpec[i + 1]) == null ? void 0 : _formSpec.twoColumn;
      ans.push(_extends({}, current, {
        colSpan: hasNext ? 12 : 24,
        labelCol: hasNext ? {
          span: 8
        } : {
          span: 4
        },
        wrapperCol: hasNext ? {
          span: 14
        } : {
          span: 7
        }
      }));
      isPreviousLeft = true;
    } else {
      //right
      ans.push(_extends({}, current, {
        colSpan: 12,
        labelCol: {
          span: 4
        },
        wrapperCol: {
          span: 16
        }
      }));
      isPreviousLeft = false;
    }
  }

  return ans;
};

var filter = function filter(inputValue, path) {
  var _this = this;

  return path.some(function (option) {
    return option[_this._labelField].toLowerCase().indexOf(inputValue.toLowerCase()) > -1;
  });
};

export var handleCascader = function handleCascader(formSpec) {
  var ans = [];
  var allCascader = {};

  var allSpecs = _.keyBy(formSpec, "label");

  for (var _iterator = _createForOfIteratorHelperLoose(formSpec), _step; !(_step = _iterator()).done;) {
    var spec = _step.value;
    ans.push(spec);
    var cascader = spec.meta.cascader;
    if (!cascader) continue;

    if (!allCascader[cascader.label]) {
      var _cascader$fieldNames;

      var newCascader = allCascader[cascader.label] = {
        fieldType: "Cascader",
        _labelField: ((_cascader$fieldNames = cascader.fieldNames) == null ? void 0 : _cascader$fieldNames.label) || "label",
        meta: _extends({}, _.omit(cascader, ["compLabels"]), {
          showSearch: {}
        }),
        name: cascader.label,
        label: cascader.label,
        targets: [spec].concat(cascader.compLabels.map(function (a) {
          return allSpecs[a];
        })),
        required: !!cascader.required,
        validate: _.noop
      };
      newCascader.meta.showSearch.filter = filter.bind(newCascader);
      ans.push(newCascader);
    }
  }

  var allTargets = _.chain(allCascader).map("targets").flatten().keyBy("label").value();

  ans = ans.filter(function (a) {
    return !allTargets[a.label];
  });

  var cascaderHook = function cascaderHook(data) {
    var result = _extends({}, data);

    for (var label in data) {
      if (!allCascader[label]) continue;
      var targets = allCascader[label].targets;

      for (var i = 0, ii = targets.length; i < ii; i++) {
        _.set(result, targets[i].name, data[label][i]);
      }

      delete result[label];
    }

    return result;
  };

  return {
    formSpec: ans,
    cascaderHook: cascaderHook
  };
};
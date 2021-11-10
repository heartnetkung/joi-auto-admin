var errorTranslation = {
  "any.required": "จำเป็นต้องกรอก",
  "string.empty": "จำเป็นต้องกรอก",
  "string.uri": "URL ไม่ถูกต้อง",
  "string.min": function stringMin(errorObj) {
    return "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E15\u0E48\u0E33\u0E01\u0E27\u0E48\u0E32 " + errorObj.context.limit + " \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23";
  },
  "string.max": function stringMax(errorObj) {
    return "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E23\u0E2D\u0E01\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + errorObj.context.limit + " \u0E15\u0E31\u0E27\u0E2D\u0E31\u0E01\u0E29\u0E23";
  },
  "string.email": "อีเมลไม่ถูกต้อง",
  "number.base": "ต้องเป็นตัวเลข"
};
export var getErrorMessage = function getErrorMessage(errorObj, label) {
  var _errorObj$context;

  label = label || (errorObj == null ? void 0 : (_errorObj$context = errorObj.context) == null ? void 0 : _errorObj$context.label);
  var message = errorObj.message,
      type = errorObj.type;
  if (/[ก-ฮ]/.test(message.replace(/"[^"]+"/g, ""))) return message;
  if (/pattern/.test(type) && label) return label + "\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07";
  var found = errorTranslation[type];
  if (!found && label) return label + "\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (" + message + ")";
  if (!found) return "\u0E04\u0E48\u0E32\u0E44\u0E21\u0E48\u0E16\u0E39\u0E01\u0E15\u0E49\u0E2D\u0E07 (" + message + ")";
  if (typeof found === "string") return found;
  return found(errorObj);
};
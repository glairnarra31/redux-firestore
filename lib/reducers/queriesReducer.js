"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = queriesReducer;
exports.isComposable = isComposable;
var _unset2 = _interopRequireDefault(require("lodash/unset"));
var _get2 = _interopRequireDefault(require("lodash/get"));
var _set2 = _interopRequireDefault(require("lodash/set"));
var _immer = _interopRequireDefault(require("immer"));
var _constants = require("../constants");
var _query = require("../utils/query");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function isComposable(action) {
  return !!(0, _get2.default)(action, 'meta.where') && !!(0, _get2.default)(action, 'meta.collection');
}
function queriesReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  return (0, _immer.default)(state, function (draft) {
    if (!isComposable(action)) {
      return state;
    }
    var key = (0, _query.getBaseQueryName)(action.meta);
    switch (action.type) {
      case _constants.actionTypes.GET_SUCCESS:
      case _constants.actionTypes.LISTENER_RESPONSE:
        draft[key] = _objectSpread({
          data: action.payload.data
        }, action.meta);
        return draft;
      case _constants.actionTypes.UNSET_LISTENER:
        if (draft[key]) {
          draft[key].data = undefined;
        }
        return draft;
      case _constants.actionTypes.DOCUMENT_ADDED:
      case _constants.actionTypes.DOCUMENT_MODIFIED:
        (0, _set2.default)(draft, [key, 'data', action.meta.doc], action.payload.data);
        return draft;
      case _constants.actionTypes.DOCUMENT_REMOVED:
      case _constants.actionTypes.DELETE_SUCCESS:
        (0, _unset2.default)(draft, [key, 'data', action.meta.doc]);
        return draft;
      default:
        return state;
    }
  });
}
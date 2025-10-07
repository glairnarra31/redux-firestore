"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.requestedReducer = requestedReducer;
exports.requestingReducer = requestingReducer;
exports.timestampsReducer = timestampsReducer;
var _constants = require("../constants");
var _reducers = require("../utils/reducers");
var _query = require("../utils/query");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var SET_LISTENER = _constants.actionTypes.SET_LISTENER,
  UNSET_LISTENER = _constants.actionTypes.UNSET_LISTENER,
  LISTENER_ERROR = _constants.actionTypes.LISTENER_ERROR,
  LISTENER_RESPONSE = _constants.actionTypes.LISTENER_RESPONSE;
function requestingReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref = arguments.length > 1 ? arguments[1] : undefined,
    type = _ref.type,
    meta = _ref.meta;
  switch (type) {
    case SET_LISTENER:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, (0, _reducers.getSlashStrPath)((0, _query.getQueryName)(meta)), true));
    case LISTENER_ERROR:
    case LISTENER_RESPONSE:
    case UNSET_LISTENER:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, (0, _reducers.getSlashStrPath)((0, _query.getQueryName)(meta)), false));
    default:
      return state;
  }
}
function requestedReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref2 = arguments.length > 1 ? arguments[1] : undefined,
    type = _ref2.type,
    meta = _ref2.meta;
  switch (type) {
    case SET_LISTENER:
    case UNSET_LISTENER:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, (0, _query.getQueryName)(meta), false));
    case LISTENER_ERROR:
    case LISTENER_RESPONSE:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, (0, _query.getQueryName)(meta), true));
    default:
      return state;
  }
}
function timestampsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _ref3 = arguments.length > 1 ? arguments[1] : undefined,
    type = _ref3.type,
    meta = _ref3.meta;
  switch (type) {
    case SET_LISTENER:
      return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, (0, _query.getQueryName)(meta), Date.now()));
    default:
      return state;
  }
}
var _default = exports.default = (0, _reducers.combineReducers)({
  requesting: requestingReducer,
  requested: requestedReducer,
  timestamps: timestampsReducer
});
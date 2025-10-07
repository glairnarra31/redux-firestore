"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createFirestoreInstance;
exports.getFirestore = getFirestore;
exports.getFirestoreInstance = getFirestoreInstance;
var _merge2 = _interopRequireDefault(require("lodash/fp/merge"));
var _actions = require("./actions");
var _actions2 = require("./utils/actions");
var _constants = require("./constants");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var firestoreInstance;
function getFirestoreInstance(firebase) {
  if (firebase && typeof firebase.firestore === 'function') {
    return firebase.firestore();
  }
  if (firebase && typeof firebase.collection === 'function') {
    return firebase;
  }
  return null;
}
function createFirestoreInstance(firebase, configs, dispatch) {
  var defaultInternals = {
    listeners: {},
    pathListenerCounts: {},
    config: _objectSpread(_objectSpread({}, _constants.defaultConfig), configs)
  };
  firebase._ = (0, _merge2.default)(defaultInternals, firebase._);
  var aliases = [{
    action: _actions.firestoreActions.deleteRef,
    name: 'delete'
  }, {
    action: _actions.firestoreActions.setListener,
    name: 'onSnapshot'
  }];
  var methods = (0, _actions2.mapWithFirebaseAndDispatch)(firebase, dispatch, _actions.firestoreActions, aliases);
  var actualFirestoreInstance = getFirestoreInstance(firebase);
  var methodsFromFirestore = _constants.methodsToAddFromFirestore.reduce(function (acc, methodName) {
    return actualFirestoreInstance && typeof actualFirestoreInstance[methodName] === 'function' ? _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, methodName, actualFirestoreInstance[methodName].bind(actualFirestoreInstance))) : acc;
  }, {});
  var firestoreGetter = typeof firebase.firestore === 'function' ? firebase.firestore : function () {
    return actualFirestoreInstance;
  };
  firestoreInstance = Object.assign(methodsFromFirestore, firestoreGetter, {
    _: firebase._
  }, configs.helpersNamespace ? _defineProperty({}, configs.helpersNamespace, methods) : methods);
  return firestoreInstance;
}
function getFirestore() {
  if (!firestoreInstance) {
    throw new Error('Firestore instance does not yet exist. Check your setup.');
  }
  return firestoreInstance;
}
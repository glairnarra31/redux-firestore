"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combineReducers = combineReducers;
exports.createReducer = createReducer;
exports.getDotStrPath = getDotStrPath;
exports.getSlashStrPath = getSlashStrPath;
exports.pathFromMeta = pathFromMeta;
exports.pathToArr = pathToArr;
exports.preserveValuesFromState = preserveValuesFromState;
exports.updateItemInArray = updateItemInArray;
var _flatten2 = _interopRequireDefault(require("lodash/flatten"));
var _trimStart2 = _interopRequireDefault(require("lodash/trimStart"));
var _replace2 = _interopRequireDefault(require("lodash/replace"));
var _pick2 = _interopRequireDefault(require("lodash/pick"));
var _isBoolean2 = _interopRequireDefault(require("lodash/isBoolean"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function pathToArr(path) {
  return path ? path.split(/\//).filter(function (p) {
    return !!p;
  }) : [];
}
function getSlashStrPath(path) {
  return (0, _trimStart2.default)((0, _replace2.default)(path, /[.]/g, '/'), '/');
}
function getDotStrPath(path) {
  return pathToArr(path).join('.');
}
function combineReducers(reducers) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments.length > 1 ? arguments[1] : undefined;
    return Object.keys(reducers).reduce(function (nextState, key) {
      nextState[key] = reducers[key](state[key], action);
      return nextState;
    }, {});
  };
}
function pathFromMeta(meta) {
  if (!meta) {
    throw new Error('Action meta is required to build path for reducers.');
  }
  var collection = meta.collection,
    collectionGroup = meta.collectionGroup,
    doc = meta.doc,
    subcollections = meta.subcollections,
    storeAs = meta.storeAs;
  if (storeAs) {
    return doc ? [storeAs, doc] : [storeAs];
  }
  if (meta.path) {
    return meta.path.split('/');
  }
  if (!collection && !collectionGroup) {
    throw new Error('Collection or Collection Group is required to construct reducer path.');
  }
  var basePath = [collection || collectionGroup];
  if (doc) {
    basePath = [].concat(_toConsumableArray(basePath), [doc]);
  }
  if (!subcollections) {
    return basePath;
  }
  var mappedCollections = subcollections.map(pathFromMeta);
  return [].concat(_toConsumableArray(basePath), _toConsumableArray((0, _flatten2.default)(mappedCollections)));
}
function updateItemInArray(array, itemId, updateItemCallback) {
  var matchFound = false;
  var modified = Array.isArray(array) ? array.map(function (item) {
    if (!item || item.id !== itemId) {
      return item;
    }
    matchFound = true;
    var updatedItem = updateItemCallback(item);
    return updatedItem;
  }) : [];
  if (!matchFound) {
    modified.push(updateItemCallback({
      id: itemId
    }));
  }
  return modified;
}
function createReducer(initialState, handlers) {
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 ? arguments[1] : undefined;
    if (handlers.hasOwnProperty(action.type)) {
      return handlers[action.type](state, action);
    }
    return state;
  };
}
function preserveValuesFromState(state, preserveSetting, nextState) {
  if ((0, _isBoolean2.default)(preserveSetting)) {
    return nextState ? _objectSpread(_objectSpread({}, state), nextState) : state;
  }
  if (typeof preserveSetting === 'function') {
    return preserveSetting(state, nextState);
  }
  if (Array.isArray(preserveSetting)) {
    return (0, _pick2.default)(state, preserveSetting);
  }
  throw new Error('Invalid preserve parameter. It must be an Object or an Array.');
}
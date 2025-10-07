"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = orderedReducer;
var _merge2 = _interopRequireDefault(require("lodash/fp/merge"));
var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));
var _keyBy2 = _interopRequireDefault(require("lodash/keyBy"));
var _map2 = _interopRequireDefault(require("lodash/map"));
var _omit2 = _interopRequireDefault(require("lodash/omit"));
var _reject2 = _interopRequireDefault(require("lodash/reject"));
var _unionBy2 = _interopRequireDefault(require("lodash/unionBy"));
var _get2 = _interopRequireDefault(require("lodash/get"));
var _size2 = _interopRequireDefault(require("lodash/size"));
var _constants = require("../constants");
var _reducers = require("../utils/reducers");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
var DOCUMENT_ADDED = _constants.actionTypes.DOCUMENT_ADDED,
  GET_SUCCESS = _constants.actionTypes.GET_SUCCESS,
  LISTENER_RESPONSE = _constants.actionTypes.LISTENER_RESPONSE,
  CLEAR_DATA = _constants.actionTypes.CLEAR_DATA,
  DELETE_SUCCESS = _constants.actionTypes.DELETE_SUCCESS,
  DOCUMENT_REMOVED = _constants.actionTypes.DOCUMENT_REMOVED,
  DOCUMENT_MODIFIED = _constants.actionTypes.DOCUMENT_MODIFIED;
function newArrayWithItemMoved(collectionState, meta, ordered, newValue) {
  var doc = meta.doc;
  var _ref = ordered || {},
    oldIndex = _ref.oldIndex,
    newIndex = _ref.newIndex;
  var arrayWithoutItem = [].concat(_toConsumableArray(collectionState.slice(0, oldIndex)), _toConsumableArray(collectionState.slice(oldIndex + 1)));
  return [].concat(_toConsumableArray(arrayWithoutItem.slice(0, newIndex)), [_objectSpread({
    id: doc
  }, newValue) || _objectSpread({}, collectionState[oldIndex])], _toConsumableArray(arrayWithoutItem.slice(newIndex)));
}
function modifyDoc(collectionState, action) {
  if (action.payload.ordered) {
    var _action$payload$order = action.payload.ordered,
      newIndex = _action$payload$order.newIndex,
      oldIndex = _action$payload$order.oldIndex;
    if (newIndex !== null && oldIndex !== null && newIndex > -1 && oldIndex > -1 && newIndex !== oldIndex) {
      return newArrayWithItemMoved(collectionState, action.meta, action.payload.ordered, action.payload.data);
    }
  }
  if (!action.meta.subcollections || action.meta.storeAs) {
    return (0, _reducers.updateItemInArray)(collectionState, action.meta.doc, function (item) {
      return (_objectSpread({
          id: action.meta.doc
        }, action.payload.data)
      );
    });
  }
  var _pathToArr = (0, _reducers.pathToArr)(action.meta.path),
    _pathToArr2 = _slicedToArray(_pathToArr, 4),
    docId = _pathToArr2[1],
    subcollectionName = _pathToArr2[2],
    subDocId = _pathToArr2[3];
  return (0, _reducers.updateItemInArray)(collectionState, docId, function (item) {
    return _objectSpread(_objectSpread({}, item), {}, _defineProperty({}, subcollectionName, (0, _reducers.updateItemInArray)((0, _get2.default)(item, subcollectionName, []), subDocId, function (subitem) {
      return (0, _merge2.default)(subitem, action.payload.data);
    })));
  });
}
function addDoc() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var meta = action.meta,
    payload = action.payload;
  if (!meta.subcollections || meta.storeAs) {
    return [].concat(_toConsumableArray(array.slice(0, payload.ordered.newIndex)), [_objectSpread({
      id: meta.doc
    }, payload.data)], _toConsumableArray(array.slice(payload.ordered.newIndex)));
  }
  return modifyDoc(array, action);
}
function removeDoc(array, action) {
  if (!action.meta.subcollections || action.meta.storeAs) {
    return (0, _reject2.default)(array, {
      id: action.meta.doc
    });
  }
  var subcollectionSetting = action.meta.subcollections[0];
  if (!subcollectionSetting.doc) {
    return (0, _reducers.updateItemInArray)(array, action.meta.doc, function (item) {
      return (0, _omit2.default)(item, [subcollectionSetting.collection]);
    });
  }
  return (0, _reducers.updateItemInArray)(array, action.meta.doc, function (item) {
    var subcollectionVal = (0, _get2.default)(item, subcollectionSetting.collection, []);
    if (subcollectionVal.length) {
      return _objectSpread(_objectSpread({}, item), {}, _defineProperty({}, subcollectionSetting.collection, (0, _reject2.default)(array, {
        id: subcollectionSetting.doc
      })));
    }
    return item;
  });
}
function writeCollection(collectionState, action) {
  var meta = action.meta,
    _action$merge = action.merge,
    merge = _action$merge === void 0 ? {
      doc: true,
      collections: true
    } : _action$merge;
  if (meta.storeAs) {
    return action.payload.ordered;
  }
  var collectionStateSize = (0, _size2.default)(collectionState);
  var payloadExists = !!(0, _size2.default)(action.payload.ordered);
  if (meta.doc && merge.doc && collectionStateSize) {
    return modifyDoc(collectionState, action);
  }
  if (collectionStateSize && merge.collections) {
    if (!payloadExists) {
      return [];
    }
    var existingKeys = collectionState && (0, _keyBy2.default)(collectionState, 'id');
    return (0, _map2.default)(action.payload.ordered, function (newDocObj) {
      var existingDoc = (0, _get2.default)(existingKeys, newDocObj.id);
      return !!existingDoc && !(0, _isEqual2.default)(existingDoc, newDocObj) ? _objectSpread(_objectSpread({}, existingDoc), newDocObj) : newDocObj;
    });
  }
  if (meta.doc && meta.subcollections) {
    var subcollectionConfig = meta.subcollections[0];
    if (!collectionStateSize) {
      return [_defineProperty({
        id: meta.doc
      }, subcollectionConfig.collection, action.payload.ordered)];
    }
    return (0, _reducers.updateItemInArray)(collectionState, meta.doc, function (item) {
      return (payloadExists ? _objectSpread(_objectSpread({}, item), {}, _defineProperty({}, subcollectionConfig.collection, (0, _unionBy2.default)((0, _get2.default)(item, subcollectionConfig.collection, []), action.payload.ordered, 'id'))) : (0, _omit2.default)(item, [subcollectionConfig.collection])
      );
    });
  }
  if (meta.doc && collectionStateSize) {
    if (!(0, _size2.default)(action.payload.ordered)) {
      return collectionState;
    }
    return (0, _reducers.updateItemInArray)(collectionState, meta.doc, function (item) {
      return (0, _merge2.default)(item, action.payload.ordered[0]);
    });
  }
  return action.payload.ordered;
}
var actionHandlers = _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, DOCUMENT_ADDED, addDoc), DOCUMENT_MODIFIED, modifyDoc), DOCUMENT_REMOVED, removeDoc), DELETE_SUCCESS, removeDoc), LISTENER_RESPONSE, writeCollection), GET_SUCCESS, writeCollection);
var orderedCollectionReducer = (0, _reducers.createReducer)(undefined, actionHandlers);
function orderedReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  if (!action.type) {
    return state;
  }
  if (action.type === CLEAR_DATA) {
    if (action.preserve && action.preserve.ordered) {
      return (0, _reducers.preserveValuesFromState)(state, action.preserve.ordered, {});
    }
    return {};
  }
  if (!Object.prototype.hasOwnProperty.call(actionHandlers, action.type)) {
    return state;
  }
  if (!action.meta || !action.meta.storeAs && !action.meta.collection) {
    return state;
  }
  var storeUnderKey = action.meta.storeAs || action.meta.collection;
  var collectionStateSlice = (0, _get2.default)(state, storeUnderKey);
  return _objectSpread(_objectSpread({}, state), {}, _defineProperty({}, storeUnderKey, orderedCollectionReducer(collectionStateSlice, action)));
}
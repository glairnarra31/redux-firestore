"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapWithFirebaseAndDispatch = mapWithFirebaseAndDispatch;
exports.wrapInDispatch = wrapInDispatch;
var _mapValues2 = _interopRequireDefault(require("lodash/mapValues"));
var _isObject2 = _interopRequireDefault(require("lodash/isObject"));
var _mutate = _interopRequireDefault(require("./mutate"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function makePayload(_ref, valToPass) {
  var payload = _ref.payload;
  return typeof payload === 'function' ? payload(valToPass) : payload;
}
function wrapInDispatch(dispatch, _ref2) {
  var ref = _ref2.ref,
    _ref2$meta = _ref2.meta,
    meta = _ref2$meta === void 0 ? {} : _ref2$meta,
    method = _ref2.method,
    _ref2$args = _ref2.args,
    args = _ref2$args === void 0 ? [] : _ref2$args,
    types = _ref2.types;
  if (typeof dispatch !== 'function') {
    throw new Error('dispatch is not a function');
  }
  var _types = _slicedToArray(types, 3),
    requestingType = _types[0],
    successType = _types[1],
    errorType = _types[2];
  var startAction = {
    type: (0, _isObject2.default)(requestingType) ? requestingType.type : requestingType,
    meta: meta,
    payload: (0, _isObject2.default)(requestingType) ? requestingType.payload : {
      args: args
    }
  };
  var optimistic = new Promise(function (resolve, reject) {
    Object.defineProperty(startAction, '_promise', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: {
        resolve: resolve,
        reject: reject
      }
    });
    if (method !== 'mutate') {
      resolve();
    }
    dispatch(startAction);
  });
  var saved = method === 'mutate' ? _mutate.default.apply(void 0, [ref].concat(_toConsumableArray(args))) : ref[method].apply(ref, _toConsumableArray(args));
  saved.then(function (result) {
    var successIsObject = (0, _isObject2.default)(successType);
    var actionObj = {
      type: successIsObject ? successType.type : successType,
      meta: meta,
      payload: successIsObject && successType.payload ? makePayload(successType, result) : {
        args: args
      }
    };
    if (successIsObject && successType.preserve) {
      actionObj.preserve = successType.preserve;
    }
    if (successIsObject && successType.merge) {
      actionObj.merge = successType.merge;
    }
    dispatch(actionObj);
    return result;
  }).catch(function (err) {
    dispatch({
      type: errorType,
      meta: meta,
      payload: err
    });
    return Promise.reject(err);
  });
  return Promise.allSettled([saved, optimistic]).then(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
      firestore = _ref4[0],
      memory = _ref4[1];
    if (memory.status === 'rejected') return Promise.reject(memory.reason);
    if (firestore.status === 'rejected') return Promise.reject(firestore.reason);
    return firestore.value;
  });
}
function createWithFirebaseAndDispatch(firebase, dispatch) {
  return function (func) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      return func.apply(firebase, [firebase, dispatch].concat(args));
    };
  };
}
function mapWithFirebaseAndDispatch(firebase, dispatch, actions, aliases) {
  var withFirebaseAndDispatch = createWithFirebaseAndDispatch(firebase, dispatch);
  return _objectSpread(_objectSpread({}, (0, _mapValues2.default)(actions, withFirebaseAndDispatch)), aliases.reduce(function (acc, _ref5) {
    var action = _ref5.action,
      name = _ref5.name;
    return _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, name, withFirebaseAndDispatch(action)));
  }, {}));
}
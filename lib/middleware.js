"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CALL_FIRESTORE = void 0;
exports.default = reduxFirestoreMiddleware;
var _constants = require("./constants");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function callFirestore(firebaseInstance, callInfoObj) {
  var method = callInfoObj.method;
  var modelArgs = callInfoObj.modelArgs,
    methodArgs = callInfoObj.methodArgs;
  if (!Array.isArray(modelArgs)) modelArgs = [modelArgs];
  if (!Array.isArray(methodArgs)) methodArgs = [methodArgs];
  if (!firebaseInstance || !firebaseInstance.firestore) {
    throw new Error('firestore is not a Firebase namespace');
  }
  return !methodArgs ? firebaseInstance.firestore()[method] : firebaseInstance.firestore()[method].apply(firebaseInstance, methodArgs);
}
var CALL_FIRESTORE = exports.CALL_FIRESTORE = 'CALL_FIRESTORE';
var typesMap = {
  get: [_constants.actionTypes.GET_REQUEST, _constants.actionTypes.GET_SUCCESS, _constants.actionTypes.GET_FAILURE]
};
function reduxFirestoreMiddleware(firestore) {
  return function (store) {
    return function (next) {
      return function (action) {
        var callAPI = action.type === CALL_FIRESTORE ? action : undefined;
        if (typeof callAPI === 'undefined') return next(action);
        var method = callAPI.method;
        if (typeof method === 'function') method = method(store.getState());
        if (typeof method !== 'string') throw new Error('Specify a method.');
        var args = callAPI.args;
        var types = typesMap[method];
        if (!Array.isArray(types) || types.length !== 3) {
          throw new Error('Expected an array of three action types.');
        }
        if (!types.every(function (type) {
          return typeof type === 'string';
        })) {
          throw new Error('Expected action types to be strings.');
        }
        function actionWith(data) {
          var finalAction = _objectSpread(_objectSpread({}, action), data);
          delete finalAction[CALL_FIRESTORE];
          return finalAction;
        }
        var _types = _slicedToArray(types, 3),
          requestType = _types[0],
          successType = _types[1],
          failureType = _types[2];
        next({
          type: requestType
        });
        var callInfoObj = {
          method: method
        };
        return callFirestore(firestore, callInfoObj).then(function (response) {
          return next({
            response: response,
            method: method,
            args: args,
            type: successType
          });
        }).catch(function (error) {
          return next(actionWith({
            type: failureType,
            error: error.message || error || 'Something bad happened'
          }));
        });
      };
    };
  };
}
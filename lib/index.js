"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CALL_FIRESTORE", {
  enumerable: true,
  get: function get() {
    return _middleware.CALL_FIRESTORE;
  }
});
Object.defineProperty(exports, "actionTypes", {
  enumerable: true,
  get: function get() {
    return _constants.actionTypes;
  }
});
Object.defineProperty(exports, "actions", {
  enumerable: true,
  get: function get() {
    return _actions.firestoreActions;
  }
});
Object.defineProperty(exports, "constants", {
  enumerable: true,
  get: function get() {
    return _constants.default;
  }
});
Object.defineProperty(exports, "createFirestoreInstance", {
  enumerable: true,
  get: function get() {
    return _createFirestoreInstance.default;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "enhancer", {
  enumerable: true,
  get: function get() {
    return _enhancer.default;
  }
});
Object.defineProperty(exports, "firestoreReducer", {
  enumerable: true,
  get: function get() {
    return _reducer.default;
  }
});
Object.defineProperty(exports, "getFirestore", {
  enumerable: true,
  get: function get() {
    return _createFirestoreInstance.getFirestore;
  }
});
Object.defineProperty(exports, "getFirestoreInstance", {
  enumerable: true,
  get: function get() {
    return _createFirestoreInstance.getFirestoreInstance;
  }
});
Object.defineProperty(exports, "getSnapshotByObject", {
  enumerable: true,
  get: function get() {
    return _query.getSnapshotByObject;
  }
});
Object.defineProperty(exports, "middleware", {
  enumerable: true,
  get: function get() {
    return _middleware.default;
  }
});
exports.mockMutate = void 0;
Object.defineProperty(exports, "reducer", {
  enumerable: true,
  get: function get() {
    return _reducer.default;
  }
});
Object.defineProperty(exports, "reduxFirestore", {
  enumerable: true,
  get: function get() {
    return _enhancer.default;
  }
});
exports.version = void 0;
var _enhancer = _interopRequireDefault(require("./enhancer"));
var _reducer = _interopRequireDefault(require("./reducer"));
var _actions = require("./actions");
var _createFirestoreInstance = _interopRequireWildcard(require("./createFirestoreInstance"));
var _constants = _interopRequireWildcard(require("./constants"));
var _middleware = _interopRequireWildcard(require("./middleware"));
var _query = require("./utils/query");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
var version = exports.version = "0.0.0-development";
var mockMutate = exports.mockMutate = function mockMutate(state, writes) {
  return new Promise(function (resolve, reject) {
    state.cache = (0, _reducer.default)(state, {
      type: _constants.actionTypes.MUTATE_START,
      payload: {
        data: writes
      },
      _promise: {
        resolve: resolve,
        reject: reject
      }
    }).cache;
  });
};
var _default = exports.default = {
  version: version,
  reducer: _reducer.default,
  firestoreReducer: _reducer.default,
  enhancer: _enhancer.default,
  reduxFirestore: _enhancer.default,
  createFirestoreInstance: _createFirestoreInstance.default,
  actions: _actions.firestoreActions,
  getFirestore: _createFirestoreInstance.getFirestore,
  getFirestoreInstance: _createFirestoreInstance.getFirestoreInstance,
  getSnapshotByObject: _query.getSnapshotByObject,
  constants: _constants.default,
  actionTypes: _constants.actionTypes,
  middleware: _middleware.default,
  CALL_FIRESTORE: _middleware.CALL_FIRESTORE,
  mockMutate: mockMutate
};
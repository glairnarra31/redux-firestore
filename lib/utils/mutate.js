"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mutate;
var _mapValues2 = _interopRequireDefault(require("lodash/mapValues"));
var _flatten2 = _interopRequireDefault(require("lodash/flatten"));
var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));
var _chunk2 = _interopRequireDefault(require("lodash/chunk"));
var _firestore = require("firebase/firestore");
var _query = require("./query");
var _excluded = ["collection", "path", "doc", "id", "data"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _regenerator() { var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i.return) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function getFirestoreInstance(firebase) {
  if (firebase && typeof firebase.firestore === 'function') {
    return firebase.firestore();
  }
  if (firebase && typeof firebase.collection === 'function') {
    return firebase;
  }
  return null;
}
var promiseAllObject = function () {
  var _ref = _asyncToGenerator(_regenerator().m(function _callee(object) {
    var _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _t = Object;
          _context.n = 1;
          return Promise.all(Object.entries(object).map(function (_ref2) {
            var _ref3 = _slicedToArray(_ref2, 2),
              key = _ref3[0],
              promise = _ref3[1];
            return promise.then(function (value) {
              return [key, value];
            });
          }));
        case 1:
          return _context.a(2, _t.fromEntries.call(_t, _context.v));
      }
    }, _callee);
  }));
  return function promiseAllObject(_x) {
    return _ref.apply(this, arguments);
  };
}();
var isDocRead = function isDocRead() {
  var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    doc = _ref4.doc,
    id = _ref4.id;
  return typeof id === 'string' || typeof doc === 'string';
};
var hasNothing = function hasNothing(snapshot) {
  return !snapshot || snapshot.empty && snapshot.empty() || snapshot.exists && snapshot.exists();
};
var primaryValue = function primaryValue(arr) {
  return Array.isArray(arr) && typeof arr[0] === 'string' && arr[0].indexOf('::') === 0 ? null : arr;
};
var arrayUnion = function arrayUnion(firebase, key) {
  if (key !== '::arrayUnion') return null;
  for (var _len = arguments.length, val = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    val[_key - 2] = arguments[_key];
  }
  if (firebase && firebase.firestore && firebase.firestore.FieldValue) {
    var _firebase$firestore$F;
    return (_firebase$firestore$F = firebase.firestore.FieldValue).arrayUnion.apply(_firebase$firestore$F, val);
  }
  return _firestore.arrayUnion.apply(void 0, val);
};
var arrayRemove = function arrayRemove(firebase, key) {
  if (key !== '::arrayRemove') return null;
  for (var _len2 = arguments.length, val = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
    val[_key2 - 2] = arguments[_key2];
  }
  if (firebase && firebase.firestore && firebase.firestore.FieldValue) {
    var _firebase$firestore$F2;
    return (_firebase$firestore$F2 = firebase.firestore.FieldValue).arrayRemove.apply(_firebase$firestore$F2, val);
  }
  return _firestore.arrayRemove.apply(void 0, val);
};
var increment = function increment(firebase, key, val) {
  if (key === '::increment' && typeof val === 'number') {
    if (firebase && firebase.firestore && firebase.firestore.FieldValue) {
      return firebase.firestore.FieldValue.increment(val);
    }
    return (0, _firestore.increment)(val);
  }
  return false;
};
var serverTimestamp = function serverTimestamp(firebase, key) {
  if (key === '::serverTimestamp') {
    if (firebase && firebase.firestore && firebase.firestore.FieldValue) {
      return firebase.firestore.FieldValue.serverTimestamp();
    }
    return (0, _firestore.serverTimestamp)();
  }
  return false;
};
function atomize(firebase, operation) {
  var requiresUpdate = false;
  return [Object.keys(operation).reduce(function (data, key) {
    var clone = _objectSpread({}, data);
    var val = clone[key];
    if (key.includes('.')) {
      requiresUpdate = true;
    }
    if (!val) return clone;
    var value = primaryValue(val) || serverTimestamp(firebase, val[0]) || arrayUnion(firebase, val[0], val[1]) || arrayRemove(firebase, val[0], val[1]) || increment(firebase, val[0], val[1]);
    if (Array.isArray(val) && val.length > 0) {
      clone[key] = value;
    }
    return clone;
  }, (0, _cloneDeep2.default)(operation)), requiresUpdate];
}
function write(firebase) {
  var operation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var writer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var collection = operation.collection,
    path = operation.path,
    doc = operation.doc,
    id = operation.id,
    data = operation.data,
    rest = _objectWithoutProperties(operation, _excluded);
  var firestoreInstance = getFirestoreInstance(firebase);
  var isNamespacedAPI = firestoreInstance && typeof firestoreInstance.doc === 'function';
  var ref = isNamespacedAPI ? firestoreInstance.doc("".concat(path || collection, "/").concat(id || doc)) : (0, _firestore.doc)(firestoreInstance, "".concat(path || collection, "/").concat(id || doc));
  var _atomize = atomize(firebase, data || rest),
    _atomize2 = _slicedToArray(_atomize, 2),
    changes = _atomize2[0],
    _atomize2$ = _atomize2[1],
    requiresUpdate = _atomize2$ === void 0 ? false : _atomize2$;
  if (writer) {
    if (requiresUpdate) {
      writer.update(ref, changes);
    } else {
      writer.set(ref, changes, {
        merge: true
      });
    }
    return _objectSpread({
      id: ref.id,
      path: ref.parent.path
    }, changes);
  }
  if (isNamespacedAPI) {
    if (requiresUpdate) {
      return ref.update(changes);
    }
    return ref.set(changes, {
      merge: true
    });
  }
  if (requiresUpdate) {
    return (0, _firestore.updateDoc)(ref, changes);
  }
  return (0, _firestore.setDoc)(ref, changes, {
    merge: true
  });
}
function writeSingle(firebase, operations) {
  var promise = write(firebase, operations);
  return promise;
}
var MAX_BATCH_COUNT = 500;
function writeInBatch(_x2, _x3) {
  return _writeInBatch.apply(this, arguments);
}
function _writeInBatch() {
  _writeInBatch = _asyncToGenerator(_regenerator().m(function _callee2(firebase, operations) {
    var firestoreInstance, isNamespacedAPI, committedBatchesPromised;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.n) {
        case 0:
          firestoreInstance = getFirestoreInstance(firebase);
          isNamespacedAPI = firestoreInstance && typeof firestoreInstance.batch === 'function';
          committedBatchesPromised = (0, _chunk2.default)(operations, MAX_BATCH_COUNT).map(function (operationsChunk) {
            var batch = isNamespacedAPI ? firestoreInstance.batch() : (0, _firestore.writeBatch)(firestoreInstance);
            var writesBatched = operationsChunk.map(function (operation) {
              return write(firebase, operation, batch);
            });
            return batch.commit().then(function () {
              return writesBatched;
            });
          });
          return _context2.a(2, Promise.all(committedBatchesPromised).then(_flatten2.default));
      }
    }, _callee2);
  }));
  return _writeInBatch.apply(this, arguments);
}
function writeInTransaction(_x4, _x5) {
  return _writeInTransaction.apply(this, arguments);
}
function _writeInTransaction() {
  _writeInTransaction = _asyncToGenerator(_regenerator().m(function _callee5(firebase, operations) {
    var firestoreInstance, isNamespacedAPI, transactionFn;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.n) {
        case 0:
          firestoreInstance = getFirestoreInstance(firebase);
          isNamespacedAPI = firestoreInstance && typeof firestoreInstance.runTransaction === 'function';
          transactionFn = function () {
            var _ref5 = _asyncToGenerator(_regenerator().m(function _callee4(transaction) {
              var serialize, readsPromised, reads, writes;
              return _regenerator().w(function (_context4) {
                while (1) switch (_context4.n) {
                  case 0:
                    serialize = function serialize(doc) {
                      return !doc ? null : _objectSpread(_objectSpread({}, doc.data()), {}, {
                        id: doc.ref.id,
                        path: doc.ref.parent.path
                      });
                    };
                    readsPromised = (0, _mapValues2.default)(operations.reads, function () {
                      var _ref6 = _asyncToGenerator(_regenerator().m(function _callee3(read) {
                        var doc, _snapshot, coll, collIsNamespacedAPI, snapshot, unserializedDocs, _t2;
                        return _regenerator().w(function (_context3) {
                          while (1) switch (_context3.n) {
                            case 0:
                              if (!(typeof read === 'function')) {
                                _context3.n = 1;
                                break;
                              }
                              return _context3.a(2, read());
                            case 1:
                              if (!isDocRead(read)) {
                                _context3.n = 3;
                                break;
                              }
                              doc = (0, _query.firestoreRef)(firebase, read);
                              _context3.n = 2;
                              return transaction.get(doc);
                            case 2:
                              _snapshot = _context3.v;
                              return _context3.a(2, serialize(_snapshot.exsits === false ? null : _snapshot));
                            case 3:
                              coll = (0, _query.firestoreRef)(firebase, read);
                              collIsNamespacedAPI = coll && typeof coll.get === 'function';
                              if (!collIsNamespacedAPI) {
                                _context3.n = 5;
                                break;
                              }
                              _context3.n = 4;
                              return coll.get();
                            case 4:
                              _t2 = _context3.v;
                              _context3.n = 7;
                              break;
                            case 5:
                              _context3.n = 6;
                              return (0, _firestore.getDocs)(coll);
                            case 6:
                              _t2 = _context3.v;
                            case 7:
                              snapshot = _t2;
                              if (!(hasNothing(snapshot) || snapshot.docs.length === 0)) {
                                _context3.n = 8;
                                break;
                              }
                              return _context3.a(2, []);
                            case 8:
                              _context3.n = 9;
                              return Promise.all(snapshot.docs.map(function (ref) {
                                return transaction.get(ref);
                              }));
                            case 9:
                              unserializedDocs = _context3.v;
                              return _context3.a(2, unserializedDocs.map(serialize));
                          }
                        }, _callee3);
                      }));
                      return function (_x7) {
                        return _ref6.apply(this, arguments);
                      };
                    }());
                    _context4.n = 1;
                    return promiseAllObject(readsPromised);
                  case 1:
                    reads = _context4.v;
                    writes = [];
                    operations.writes.forEach(function (writeFnc) {
                      var operation = typeof writeFnc === 'function' ? writeFnc(reads) : writeFnc;
                      if (Array.isArray(operation)) {
                        operation.map(function (op) {
                          return write(firebase, op, transaction);
                        });
                        writes.push(operation);
                      } else {
                        writes.push(write(firebase, operation, transaction));
                      }
                    });
                    return _context4.a(2, {
                      reads: reads,
                      writes: writes
                    });
                }
              }, _callee4);
            }));
            return function transactionFn(_x6) {
              return _ref5.apply(this, arguments);
            };
          }();
          if (!isNamespacedAPI) {
            _context5.n = 1;
            break;
          }
          return _context5.a(2, firestoreInstance.runTransaction(transactionFn));
        case 1:
          return _context5.a(2, (0, _firestore.runTransaction)(firestoreInstance, transactionFn));
      }
    }, _callee5);
  }));
  return _writeInTransaction.apply(this, arguments);
}
function mutate(firestore, operations) {
  if (typeof (operations === null || operations === void 0 ? void 0 : operations.path) === 'string' || typeof (operations === null || operations === void 0 ? void 0 : operations.collection) === 'string') {
    return writeSingle(firestore, operations);
  }
  if (Array.isArray(operations)) {
    return writeInBatch(firestore, operations);
  }
  return writeInTransaction(firestore, operations);
}
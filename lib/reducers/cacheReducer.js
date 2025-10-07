"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = cacheReducer;
var _identity2 = _interopRequireDefault(require("lodash/identity"));
var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));
var _takeRight2 = _interopRequireDefault(require("lodash/takeRight"));
var _isEqual2 = _interopRequireDefault(require("lodash/isEqual"));
var _get2 = _interopRequireDefault(require("lodash/get"));
var _isMatch2 = _interopRequireDefault(require("lodash/isMatch"));
var _findIndex2 = _interopRequireDefault(require("lodash/findIndex"));
var _setWith2 = _interopRequireDefault(require("lodash/setWith"));
var _zip4 = _interopRequireDefault(require("lodash/zip"));
var _partialRight2 = _interopRequireDefault(require("lodash/partialRight"));
var _map2 = _interopRequireDefault(require("lodash/map"));
var _take2 = _interopRequireDefault(require("lodash/take"));
var _orderBy2 = _interopRequireDefault(require("lodash/orderBy"));
var _flow2 = _interopRequireDefault(require("lodash/flow"));
var _filter2 = _interopRequireDefault(require("lodash/filter"));
var _unset2 = _interopRequireDefault(require("lodash/unset"));
var _set2 = _interopRequireDefault(require("lodash/set"));
var _immer = _interopRequireDefault(require("immer"));
var _firestore = require("firebase/firestore");
var _constants = require("../constants");
var _query = require("../utils/query");
var _HANDLERS;
var _excluded = ["collection", "path", "doc", "id", "data"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var isTimestamp = function isTimestamp(a) {
  return a instanceof Object && a.seconds !== undefined;
};
var PROCESSES = {
  '<': function _(a, b) {
    return a < b;
  },
  '<=': function _(a, b) {
    return a <= b;
  },
  '==': function _(a, b) {
    return a === b;
  },
  '!=': function _(a, b) {
    return a !== b;
  },
  '>=': function _(a, b) {
    return a >= b;
  },
  '>': function _(a, b) {
    return a > b;
  },
  'array-contains': function arrayContains(a, b) {
    return a.includes(b);
  },
  in: function _in(a, b) {
    return Array.isArray(b) && b.includes(a);
  },
  'array-contains-any': function arrayContainsAny(a, b) {
    return b.some(function (b1) {
      return a.includes(b1);
    });
  },
  'not-in': function notIn(a, b) {
    return !b.includes(a);
  },
  '*': function _() {
    return true;
  }
};
var PROCESSES_TIMESTAMP = {
  '<': function _(a, b) {
    return a.seconds < b.seconds || a.seconds === b.seconds && a.nanoseconds < b.nanoseconds;
  },
  '<=': function _(a, b) {
    return a.seconds < b.seconds || a.seconds === b.seconds && a.nanoseconds <= b.nanoseconds;
  },
  '==': function _(a, b) {
    return a.seconds === b.seconds && a.nanoseconds === b.nanoseconds;
  },
  '!=': function _(a, b) {
    return a.seconds !== b.seconds || a.nanoseconds !== b.nanoseconds;
  },
  '>=': function _(a, b) {
    return a.seconds > b.seconds || a.seconds === b.seconds && a.nanoseconds >= b.nanoseconds;
  },
  '>': function _(a, b) {
    return a.seconds > b.seconds || a.seconds === b.seconds && a.nanoseconds > b.nanoseconds;
  },
  'array-contains': function arrayContains(a, b) {
    return a.includes(b);
  },
  in: function _in(a, b) {
    return Array.isArray(b) && b.includes(a);
  },
  'array-contains-any': function arrayContainsAny(a, b) {
    return b.some(function (b1) {
      return a.includes(b1);
    });
  },
  'not-in': function notIn(a, b) {
    return !b.includes(a);
  },
  '*': function _() {
    return true;
  }
};
var xfVerbose = function xfVerbose(title) {
  return (0, _partialRight2.default)(_map2.default, function (data) {
    return data;
  });
};
var xfAllIds = function xfAllIds(_ref) {
  var path = _ref.collection;
  return function allIdsTransducer(state) {
    var _state$database = state.database,
      db = _state$database === void 0 ? {} : _state$database,
      _state$databaseOverri = state.databaseOverrides,
      dbo = _state$databaseOverri === void 0 ? {} : _state$databaseOverri;
    var allIds = new Set([].concat(_toConsumableArray(Object.keys(db[path] || {})), _toConsumableArray(Object.keys(dbo[path] || {}))));
    return [Array.from(allIds).map(function (id) {
      return [path, id];
    })];
  };
};
var xfWhere = function xfWhere(_ref2, getDoc) {
  var where = _ref2.where;
  if (!where) return [(0, _partialRight2.default)(_map2.default, _identity2.default)];
  var isFlat = typeof where[0] === 'string';
  var clauses = isFlat ? [where] : where;
  return clauses.map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 3),
      field = _ref4[0],
      op = _ref4[1],
      val = _ref4[2];
    var fnc = isTimestamp(val) ? PROCESSES_TIMESTAMP[op] : PROCESSES[op] || function () {
      return true;
    };
    return (0, _partialRight2.default)(_map2.default, function (tuples) {
      return (0, _filter2.default)(tuples, function () {
        var _ref5 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
          _ref6 = _slicedToArray(_ref5, 2),
          path = _ref6[0],
          id = _ref6[1];
        if (!path || !id) return false;
        var value;
        if (field === '__name__') {
          value = id;
        } else if (field.includes('.')) {
          value = field.split('.').reduce(function (obj, subField) {
            return obj && obj[subField];
          }, getDoc(path, id));
        } else {
          value = getDoc(path, id)[field];
        }
        if (value === undefined) value = null;
        return fnc(value, val);
      });
    });
  });
};
var xfOrder = function xfOrder(_ref7, getDoc) {
  var order = _ref7.orderBy;
  if (!order) return _identity2.default;
  var isFlat = typeof order[0] === 'string';
  var orders = isFlat ? [order] : order;
  var _zip2 = _zip4.default.apply(void 0, _toConsumableArray(orders.map(function (_ref8) {
      var _ref9 = _slicedToArray(_ref8, 2),
        field = _ref9[0],
        dir = _ref9[1];
      return [function (data) {
        if (typeof data[field] === 'string') return data[field].toLowerCase();
        if (isTimestamp(data[field])) return data[field].seconds;
        return data[field];
      }, dir || 'asc'];
    }))),
    _zip3 = _slicedToArray(_zip2, 2),
    fields = _zip3[0],
    direction = _zip3[1];
  return (0, _partialRight2.default)(_map2.default, function (tuples) {
    var docs = tuples.map(function (_ref0) {
      var _ref1 = _slicedToArray(_ref0, 2),
        path = _ref1[0],
        id = _ref1[1];
      return getDoc(path, id);
    });
    return (0, _orderBy2.default)(docs, fields, direction).map(function () {
      var _ref10 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        id = _ref10.id,
        path = _ref10.path;
      return path && id && [path, id];
    });
  });
};
var xfLimit = function xfLimit(_ref11) {
  var limit = _ref11.limit,
    endAt = _ref11.endAt,
    endBefore = _ref11.endBefore;
  if (!limit) return _identity2.default;
  var fromRight = (endAt || endBefore) !== undefined;
  return fromRight ? function () {
    var _ref12 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
      _ref13 = _slicedToArray(_ref12, 1),
      arr = _ref13[0];
    return [(0, _takeRight2.default)(arr, limit)];
  } : function () {
    var _ref14 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [],
      _ref15 = _slicedToArray(_ref14, 1),
      arr = _ref15[0];
    return [(0, _take2.default)(arr, limit)];
  };
};
var xfPaginate = function xfPaginate(query, getDoc) {
  var order = query.orderBy,
    limit = query.limit,
    startAt = query.startAt,
    startAfter = query.startAfter,
    endAt = query.endAt,
    endBefore = query.endBefore;
  var start = startAt || startAfter;
  var end = endAt || endBefore;
  var isAfter = startAfter !== undefined;
  var isBefore = endBefore !== undefined;
  var needsPagination = start || end || false;
  if (!needsPagination || !order) return _identity2.default;
  var isFlat = typeof order[0] === 'string';
  var orders = isFlat ? [order] : order;
  var isPaginateMatched = function isPaginateMatched(document, at) {
    var before = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var after = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    return orders.find(function (_ref16, idx) {
      var _ref17 = _slicedToArray(_ref16, 2),
        field = _ref17[0],
        _ref17$ = _ref17[1],
        sort = _ref17$ === void 0 ? 'asc' : _ref17$;
      var value = Array.isArray(at) ? at[idx] : at;
      if (value === undefined) return false;
      var isTime = isTimestamp(document[field]);
      var proc = isTime ? PROCESSES_TIMESTAMP : PROCESSES;
      var compare = process['=='];
      if (startAt || endAt) compare = proc[sort === 'desc' ? '<=' : '>='];
      if (startAfter || endBefore) compare = proc[sort === 'desc' ? '<' : '>'];
      var isMatched = compare(document[field], value);
      return isMatched;
    }) !== undefined;
  };
  return (0, _partialRight2.default)(_map2.default, function (tuples) {
    var results = [];
    var started = start === undefined;
    tuples.forEach(function (_ref18) {
      var _ref19 = _slicedToArray(_ref18, 2),
        path = _ref19[0],
        id = _ref19[1];
      if (limit && results.length >= limit) return;
      if (!started && start) {
        if (isPaginateMatched(getDoc(path, id), start, undefined, isAfter)) {
          started = true;
        }
      }
      if (started && end) {
        if (isPaginateMatched(getDoc(path, id), end, isBefore, undefined)) {
          started = false;
        }
      }
      if (started) {
        results.push([path, id]);
      }
    });
    return results;
  });
};
function processOptimistic(query, state) {
  var database = state.database,
    databaseOverrides = state.databaseOverrides;
  var _query$via = query.via,
    via = _query$via === void 0 ? 'memory' : _query$via,
    collection = query.collection;
  var db = database && database[collection] || {};
  var dbo = databaseOverrides && databaseOverrides[collection];
  var getDoc = function getDoc(path, id) {
    var data = db[id] || {};
    var override = dbo === null || dbo === void 0 ? void 0 : dbo[id];
    return override ? _objectSpread(_objectSpread({}, data), override) : data;
  };
  var process = (0, _flow2.default)([xfAllIds(query), xfVerbose('xfAllIds')].concat(_toConsumableArray(xfWhere(query, getDoc)), [xfVerbose('xfWhere'), xfOrder(query, getDoc), xfVerbose('xfOrder'), xfPaginate(query, getDoc), xfVerbose('xfPaginate'), xfLimit(query), xfVerbose('xfLimit')]));
  var ordered = process(state)[0];
  return via === 'memory' && ordered.length === 0 ? undefined : ordered;
}
var skipReprocessing = function skipReprocessing(query, _ref20) {
  var _ref20$databaseOverri = _ref20.databaseOverrides,
    databaseOverrides = _ref20$databaseOverri === void 0 ? {} : _ref20$databaseOverri;
  var collection = query.collection,
    via = query.via;
  var fromFirestore = ['cache', 'server'].includes(via);
  var hasNoOverrides = (0, _isEmpty2.default)(databaseOverrides[collection]);
  if (fromFirestore && hasNoOverrides) return true;
  return false;
};
function reprocessQueries(draft, path) {
  var _draft$databaseOverri;
  var queries = [];
  var paths = Array.isArray(path) ? path : [path];
  var overrides = (_draft$databaseOverri = draft.databaseOverrides) === null || _draft$databaseOverri === void 0 ? void 0 : _draft$databaseOverri[path];
  Object.keys(draft).forEach(function (key) {
    var _draft$key$ordered;
    if (['database', 'databaseOverrides'].includes(key)) return;
    if (!paths.includes(draft[key].collection)) return;
    if (skipReprocessing(draft[key], draft)) return;
    queries.push(key);
    var ordered = processOptimistic(draft[key], draft);
    if (!draft[key].ordered || (ordered !== null && ordered !== void 0 ? ordered : []).toString() !== ((_draft$key$ordered = draft[key].ordered) !== null && _draft$key$ordered !== void 0 ? _draft$key$ordered : []).toString()) {
      (0, _set2.default)(draft, [key, 'ordered'], ordered);
      (0, _set2.default)(draft, [key, 'via'], !(0, _isEmpty2.default)(overrides) ? 'optimistic' : 'memory');
    }
  });
}
var primaryValue = function primaryValue(arr) {
  return typeof arr[0] === 'string' && arr[0].indexOf('::') === 0 ? null : arr;
};
var nestedMap = function nestedMap(obj, key, val) {
  delete obj[key];
  var fields = key.split('.');
  fields.reduce(function (deep, field, idx) {
    if (deep[field] === undefined) deep[field] = {};
    if (idx === fields.length - 1) deep[field] = val;
    return deep[field];
  }, obj);
  return obj;
};
var arrayUnion = function arrayUnion(key, val, cached) {
  return key !== '::arrayUnion' ? null : (cached() || []).concat([val]);
};
var arrayRemove = function arrayRemove(key, val, cached) {
  return key === '::arrayRemove' && (cached() || []).filter(function (item) {
    return item !== val;
  });
};
var increment = function increment(key, val, cached) {
  return key === '::increment' && typeof val === 'number' && (cached() || 0) + val;
};
var serverTimestamp = function serverTimestamp(key) {
  return key === '::serverTimestamp' && _firestore.Timestamp.now();
};
function atomize(mutation, cached) {
  return Object.keys(mutation).reduce(function (data, key) {
    var val = data[key];
    if (key.includes('.')) {
      nestedMap(data, key, val);
    } else if (Array.isArray(val) && val.length > 0) {
      data[key] = primaryValue(val) || serverTimestamp(val[0]) || arrayUnion(val[0], val[1], function () {
        return cached(key);
      }) || arrayRemove(val[0], val[1], function () {
        return cached(key);
      }) || increment(val[0], val[1], function () {
        return cached(key);
      });
    }
    return data;
  }, JSON.parse(JSON.stringify(mutation)));
}
function translateMutationToOverrides(_ref21) {
  var payload = _ref21.payload;
  var db = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var dbo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _ref22 = payload.data || {},
    reads = _ref22.reads,
    writes = _ref22.writes;
  if (!writes) {
    writes = Array.isArray(payload.data) ? payload.data : [payload.data];
  } else if (!Array.isArray(writes)) {
    writes = [writes];
  }
  var optimistic = {};
  if (reads) {
    optimistic = Object.keys(reads).reduce(function (result, key) {
      var _reads$key, _reads$key2, _reads$key3, _reads$key4;
      if (typeof reads[key] === 'function') {
        return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, reads[key]()));
      }
      var path = ((_reads$key = reads[key]) === null || _reads$key === void 0 ? void 0 : _reads$key.path) || ((_reads$key2 = reads[key]) === null || _reads$key2 === void 0 ? void 0 : _reads$key2.collection);
      var id = ((_reads$key3 = reads[key]) === null || _reads$key3 === void 0 ? void 0 : _reads$key3.id) || ((_reads$key4 = reads[key]) === null || _reads$key4 === void 0 ? void 0 : _reads$key4.doc);
      var collection = db[path] || {};
      var overrides = dbo[path] || {};
      return _objectSpread(_objectSpread({}, result), {}, _defineProperty({}, key, _objectSpread(_objectSpread({
        id: id,
        path: path
      }, collection[id]), overrides[id] || {})));
    }, {});
  }
  var overrides = writes.map(function (writer) {
    return typeof writer === 'function' ? writer(optimistic) : writer;
  }).filter(function (data) {
    return !data || !(0, _isEmpty2.default)(data);
  }).reduce(function (flat, result) {
    return [].concat(_toConsumableArray(flat), _toConsumableArray(Array.isArray(result) ? result : [result]));
  }, []).map(function (write) {
    var collection = write.collection,
      path = write.path,
      doc = write.doc,
      id = write.id,
      data = write.data,
      rest = _objectWithoutProperties(write, _excluded);
    var coll = path || collection;
    var docId = id || doc;
    return _objectSpread({
      path: coll,
      id: docId
    }, atomize(collection ? data : rest, function (key) {
      var database = Object.keys(db).length > 0 ? db : {};
      var location = database[coll] || {};
      return (location[docId] || {})[key];
    }));
  });
  return overrides;
}
function cleanOverride(draft, _ref23) {
  var path = _ref23.path,
    id = _ref23.id,
    data = _ref23.data;
  if (!path || !id) return;
  var override = (0, _get2.default)(draft, ['databaseOverrides', path, id], false);
  if (!override || data && !(0, _isMatch2.default)(data, override)) return;
  var keys = Object.keys(override);
  var props = !data ? keys : keys.filter(function (key) {
    var current = (0, _get2.default)(data, key);
    var optimistic = override[key];
    if (current === null || current === undefined) {
      return current === optimistic;
    }
    if (Array.isArray(current)) {
      return current.every(function (val, idx) {
        return val === optimistic[idx];
      });
    }
    if (_typeof(current) === 'object') {
      return Object.keys(current).every(function (currentKey) {
        return current[currentKey] === optimistic[currentKey];
      });
    }
    return (0, _isEqual2.default)(data[key], override[key]);
  });
  var isDone = props.length === Object.keys(override).length;
  var dataIsEmpty = isDone && Object.keys(draft.databaseOverrides[path] || {}).length === 1;
  if (dataIsEmpty) {
    (0, _unset2.default)(draft, ['databaseOverrides', path]);
  } else if (isDone) {
    (0, _unset2.default)(draft, ['databaseOverrides', path, id]);
  } else {
    props.forEach(function (prop) {
      (0, _unset2.default)(draft, ['databaseOverrides', path, id, prop]);
    });
  }
}
var initialize = function initialize(state, _ref24) {
  var action = _ref24.action,
    key = _ref24.key,
    path = _ref24.path;
  return (0, _immer.default)(state, function (draft) {
    var _draft$databaseOverri2, _action$payload$order;
    if (!draft.database) {
      (0, _set2.default)(draft, ['database'], {});
      (0, _set2.default)(draft, ['databaseOverrides'], {});
    }
    var hasOptimistic = !(0, _isEmpty2.default)((_draft$databaseOverri2 = draft.databaseOverrides) === null || _draft$databaseOverri2 === void 0 ? void 0 : _draft$databaseOverri2[path]);
    var via = {
      undefined: hasOptimistic ? 'optimistic' : 'memory',
      true: 'cache',
      false: 'server'
    }[action.payload.fromCache];
    if (action.payload.data) {
      Object.keys(action.payload.data).forEach(function (id) {
        (0, _setWith2.default)(draft, ['database', path, id], action.payload.data[id], Object);
        cleanOverride(draft, {
          path: path,
          id: id,
          data: action.payload.data[id]
        });
      });
    }
    var ordered = ((_action$payload$order = action.payload.ordered) === null || _action$payload$order === void 0 ? void 0 : _action$payload$order.map(function (_ref25) {
      var _path = _ref25.path,
        id = _ref25.id;
      return [_path, id];
    })) || processOptimistic(action.meta, draft);
    (0, _set2.default)(draft, [action.meta.storeAs], _objectSpread(_objectSpread({
      ordered: ordered
    }, action.meta), {}, {
      via: via
    }));
    reprocessQueries(draft, path);
    return draft;
  });
};
var conclude = function conclude(state, _ref26) {
  var action = _ref26.action,
    key = _ref26.key,
    path = _ref26.path;
  return (0, _immer.default)(state, function (draft) {
    if (draft[key]) {
      if (!action.payload.preserveCache) {
        (0, _unset2.default)(draft, [key]);
      }
      reprocessQueries(draft, path);
    }
    return draft;
  });
};
var modify = function modify(state, _ref27) {
  var action = _ref27.action,
    key = _ref27.key,
    path = _ref27.path;
  return (0, _immer.default)(state, function (draft) {
    (0, _setWith2.default)(draft, ['database', path, action.meta.doc], action.payload.data, Object);
    cleanOverride(draft, {
      path: path,
      id: action.meta.doc,
      data: action.payload.data
    });
    var payload = action.payload;
    var _ref28 = payload.ordered || {},
      _ref28$oldIndex = _ref28.oldIndex,
      oldIndex = _ref28$oldIndex === void 0 ? 0 : _ref28$oldIndex,
      _ref28$newIndex = _ref28.newIndex,
      newIndex = _ref28$newIndex === void 0 ? 0 : _ref28$newIndex;
    if (newIndex !== oldIndex) {
      var tuple = payload.data && [payload.data.path, payload.data.id] || draft[key].ordered[oldIndex];
      var _ref29 = draft[key] || {
          ordered: []
        },
        ordered = _ref29.ordered;
      var idx = (0, _findIndex2.default)(ordered, [1, action.meta.doc]);
      var isIndexChange = idx !== -1;
      var isAddition = oldIndex === -1 || isIndexChange;
      var isRemoval = newIndex === -1 || isIndexChange;
      if (isRemoval && idx > -1) {
        ordered.splice(idx, 0);
      } else if (isAddition) {
        ordered.splice(newIndex, 0, tuple);
      }
      (0, _set2.default)(draft, [key, 'ordered'], ordered);
    }
    if (action.meta.reprocess !== false) {
      reprocessQueries(draft, path);
    }
    return draft;
  });
};
var failure = function failure(state, _ref30) {
  var action = _ref30.action,
    key = _ref30.key,
    path = _ref30.path;
  return (0, _immer.default)(state, function (draft) {
    if (action.payload.data || action.payload.args) {
      var write = action.payload.data ? [{
        writes: [action.payload.data]
      }] : action.payload.args;
      var allPaths = write.reduce(function (results, _ref31) {
        var writes = _ref31.writes;
        return [].concat(_toConsumableArray(results), _toConsumableArray(writes.map(function (_ref32) {
          var collection = _ref32.collection,
            _path = _ref32.path,
            doc = _ref32.doc,
            id = _ref32.id;
          cleanOverride(draft, {
            path: _path || collection,
            id: id || doc
          });
          return path || collection;
        })));
      }, []);
      var uniquePaths = Array.from(new Set(allPaths));
      if (uniquePaths.length > 0) {
        reprocessQueries(draft, uniquePaths);
      }
    }
    return draft;
  });
};
var deletion = function deletion(state, _ref33) {
  var action = _ref33.action,
    key = _ref33.key,
    path = _ref33.path;
  return (0, _immer.default)(state, function (draft) {
    if (draft.database && draft.database[path]) {
      (0, _unset2.default)(draft, ['database', path, action.meta.doc]);
    }
    cleanOverride(draft, {
      path: path,
      id: action.meta.doc
    });
    if (draft[key] && draft[key].ordered) {
      var idx = (0, _findIndex2.default)(draft[key].ordered, [1, action.meta.doc]);
      draft[key].ordered.splice(idx, 1);
    }
    reprocessQueries(draft, path);
    return draft;
  });
};
var remove = function remove(state, _ref34) {
  var action = _ref34.action,
    key = _ref34.key,
    path = _ref34.path;
  return (0, _immer.default)(state, function (draft) {
    cleanOverride(draft, {
      path: path,
      id: action.meta.doc,
      data: action.payload.data
    });
    if (draft[key] && draft[key].ordered) {
      var idx = (0, _findIndex2.default)(draft[key].ordered, [1, action.meta.doc]);
      var wasNotAlreadyRemoved = idx !== -1;
      if (wasNotAlreadyRemoved) {
        draft[key].ordered.splice(idx, 1);
      }
    }
    reprocessQueries(draft, path);
    return draft;
  });
};
var optimistic = function optimistic(state, _ref35) {
  var action = _ref35.action,
    key = _ref35.key,
    path = _ref35.path;
  return (0, _immer.default)(state, function (draft) {
    (0, _setWith2.default)(draft, ['databaseOverrides', path, action.meta.doc], action.payload.data, Object);
    reprocessQueries(draft, path);
    return draft;
  });
};
var reset = function reset(state, _ref36) {
  var action = _ref36.action,
    key = _ref36.key,
    path = _ref36.path;
  return (0, _immer.default)(state, function (draft) {
    cleanOverride(draft, {
      path: path,
      id: action.meta.doc
    });
    reprocessQueries(draft, path);
    return draft;
  });
};
var mutation = function mutation(state, _ref37) {
  var action = _ref37.action,
    key = _ref37.key,
    path = _ref37.path;
  var _promise = action._promise;
  try {
    var result = (0, _immer.default)(state, function (draft) {
      if (action.payload && action.payload.data) {
        var optimisiticUpdates = translateMutationToOverrides(action, draft.database) || [];
        optimisiticUpdates.forEach(function (data) {
          (0, _setWith2.default)(draft, ['databaseOverrides', data.path, data.id], data, Object);
        });
        var updatePaths = _toConsumableArray(new Set(optimisiticUpdates.map(function (_ref38) {
          var _path = _ref38.path;
          return _path;
        })));
        updatePaths.forEach(function (_path) {
          reprocessQueries(draft, _path);
        });
      }
      _promise === null || _promise === void 0 || _promise.resolve();
      return draft;
    });
    return result;
  } catch (error) {
    _promise === null || _promise === void 0 || _promise.reject(error);
    return state;
  }
};
var HANDLERS = (_HANDLERS = {}, _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_HANDLERS, _constants.actionTypes.SET_LISTENER, initialize), _constants.actionTypes.LISTENER_RESPONSE, initialize), _constants.actionTypes.GET_SUCCESS, initialize), _constants.actionTypes.UNSET_LISTENER, conclude), _constants.actionTypes.DOCUMENT_ADDED, modify), _constants.actionTypes.DOCUMENT_MODIFIED, modify), _constants.actionTypes.DELETE_SUCCESS, deletion), _constants.actionTypes.DOCUMENT_REMOVED, remove), _constants.actionTypes.OPTIMISTIC_ADDED, optimistic), _constants.actionTypes.OPTIMISTIC_MODIFIED, optimistic), _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_HANDLERS, _constants.actionTypes.OPTIMISTIC_REMOVED, reset), _constants.actionTypes.MUTATE_FAILURE, failure), _constants.actionTypes.DELETE_FAILURE, failure), _constants.actionTypes.UPDATE_FAILURE, failure), _constants.actionTypes.SET_FAILURE, failure), _constants.actionTypes.ADD_FAILURE, failure), _constants.actionTypes.MUTATE_START, mutation));
function cacheReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var fnc = HANDLERS[action.type];
  if (!fnc) return state;
  var key = !action.meta || !action.meta.collection ? null : action.meta.storeAs || (0, _query.getBaseQueryName)(action.meta);
  var path = !action.meta ? null : action.meta.collection;
  return fnc(state, {
    action: action,
    key: key,
    path: path
  });
}
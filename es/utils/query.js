"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.attachListener = attachListener;
exports.dataByIdSnapshot = dataByIdSnapshot;
exports.detachListener = detachListener;
exports.dispatchListenerResponse = dispatchListenerResponse;
exports.firestoreRef = firestoreRef;
exports.getBaseQueryName = getBaseQueryName;
exports.getPopulateActions = getPopulateActions;
exports.getQueryConfig = getQueryConfig;
exports.getQueryConfigs = getQueryConfigs;
exports.getQueryName = getQueryName;
exports.getSnapshotByObject = getSnapshotByObject;
exports.listenerExists = listenerExists;
exports.orderedFromSnap = orderedFromSnap;
exports.queryStrToObj = queryStrToObj;
exports.snapshotCache = void 0;
var _cloneDeep2 = _interopRequireDefault(require("lodash/cloneDeep"));
var _set2 = _interopRequireDefault(require("lodash/set"));
var _get2 = _interopRequireDefault(require("lodash/get"));
var _map2 = _interopRequireDefault(require("lodash/map"));
var _has2 = _interopRequireDefault(require("lodash/has"));
var _forEach2 = _interopRequireDefault(require("lodash/forEach"));
var _trim2 = _interopRequireDefault(require("lodash/trim"));
var _isEmpty2 = _interopRequireDefault(require("lodash/isEmpty"));
var _isNumber2 = _interopRequireDefault(require("lodash/isNumber"));
var _isObject2 = _interopRequireDefault(require("lodash/isObject"));
var _constants = require("../constants");
var _excluded = ["path", "collection", "collectionGroup", "id", "doc", "subcollections", "storeAs"],
  _excluded2 = ["path", "collection", "collectionGroup", "subcollections"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _toArray(r) { return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], -1 === t.indexOf(o) && {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (-1 !== e.indexOf(n)) continue; t[n] = r[n]; } return t; }
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
function getFirestoreInstance(firebase) {
  if (firebase && typeof firebase.firestore === 'function') {
    return firebase.firestore();
  }
  if (firebase && typeof firebase.collection === 'function') {
    return firebase;
  }
  return null;
}
var snapshotCache = exports.snapshotCache = new WeakMap();
function getSnapshotByObject(obj) {
  return snapshotCache.get(obj);
}
function addWhereToRef(ref, where) {
  if (!Array.isArray(where)) {
    throw new Error('where parameter must be an array.');
  }
  if (Array.isArray(where[0])) {
    return where.reduce(function (acc, whereArgs) {
      return addWhereToRef(acc, whereArgs);
    }, ref);
  }
  return ref.where.apply(ref, _toConsumableArray(where));
}
function addOrderByToRef(ref, orderBy) {
  if (!Array.isArray(orderBy) && !(typeof orderBy === 'string' || orderBy instanceof String)) {
    throw new Error('orderBy parameter must be an array or string.');
  }
  if (typeof orderBy === 'string' || orderBy instanceof String) {
    return ref.orderBy(orderBy);
  }
  if (typeof orderBy[0] === 'string' || orderBy[0] instanceof String) {
    return ref.orderBy.apply(ref, _toConsumableArray(orderBy));
  }
  return orderBy.reduce(function (acc, orderByArgs) {
    return addOrderByToRef(acc, orderByArgs);
  }, ref);
}
function arrayify(cursor) {
  return [].concat(cursor);
}
function handleSubcollections(ref, subcollectionList) {
  if (Array.isArray(subcollectionList)) {
    subcollectionList.forEach(function (subcollection) {
      if (subcollection.collection) {
        if (typeof ref.collection !== 'function') {
          throw new Error("Collection can only be run on a document. Check that query config for subcollection: \"".concat(subcollection.collection, "\" contains a doc parameter."));
        }
        ref = ref.collection(subcollection.collection);
      }
      if (subcollection.id) ref = ref.doc(subcollection.id);
      if (subcollection.doc) ref = ref.doc(subcollection.doc);
      if (subcollection.where) ref = addWhereToRef(ref, subcollection.where);
      if (subcollection.orderBy) {
        ref = addOrderByToRef(ref, subcollection.orderBy);
      }
      if (subcollection.limit) ref = ref.limit(subcollection.limit);
      if (subcollection.startAt) {
        var _ref;
        ref = (_ref = ref).startAt.apply(_ref, _toConsumableArray(arrayify(subcollection.startAt)));
      }
      if (subcollection.startAfter) {
        var _ref2;
        ref = (_ref2 = ref).startAfter.apply(_ref2, _toConsumableArray(arrayify(subcollection.startAfter)));
      }
      if (subcollection.endAt) {
        var _ref3;
        ref = (_ref3 = ref).endAt.apply(_ref3, _toConsumableArray(arrayify(subcollection.endAt)));
      }
      if (subcollection.endBefore) {
        var _ref4;
        ref = (_ref4 = ref).endBefore.apply(_ref4, _toConsumableArray(arrayify(subcollection.endBefore)));
      }
      ref = handleSubcollections(ref, subcollection.subcollections);
    });
  }
  return ref;
}
function firestoreRef(firebase, meta) {
  var _ref6, _ref7, _ref8, _ref9;
  if (!firebase.firestore) {
    throw new Error('Firestore must be required and initalized.');
  }
  var path = meta.path,
    collection = meta.collection,
    collectionGroup = meta.collectionGroup,
    id = meta.id,
    doc = meta.doc,
    subcollections = meta.subcollections,
    where = meta.where,
    orderBy = meta.orderBy,
    limit = meta.limit,
    startAt = meta.startAt,
    startAfter = meta.startAfter,
    endAt = meta.endAt,
    endBefore = meta.endBefore;
  var ref = getFirestoreInstance(firebase);
  if (collection && collectionGroup) {
    throw new Error('Reference cannot contain both Collection and CollectionGroup.');
  }
  var _ref5 = firebase && firebase._ && firebase._.config || {},
    globalDataConvertor = _ref5.globalDataConvertor;
  if (path || collection) ref = ref.collection(path || collection);
  if (collectionGroup) ref = ref.collectionGroup(collectionGroup);
  if (id || doc) ref = ref.doc(id || doc);
  ref = handleSubcollections(ref, subcollections);
  if (where) ref = addWhereToRef(ref, where);
  if (orderBy) ref = addOrderByToRef(ref, orderBy);
  if (limit) ref = ref.limit(limit);
  if (startAt) ref = (_ref6 = ref).startAt.apply(_ref6, _toConsumableArray(arrayify(startAt)));
  if (startAfter) ref = (_ref7 = ref).startAfter.apply(_ref7, _toConsumableArray(arrayify(startAfter)));
  if (endAt) ref = (_ref8 = ref).endAt.apply(_ref8, _toConsumableArray(arrayify(endAt)));
  if (endBefore) ref = (_ref9 = ref).endBefore.apply(_ref9, _toConsumableArray(arrayify(endBefore)));
  if (globalDataConvertor) ref = ref.withConverter(globalDataConvertor);
  return ref;
}
function arrayToStr(key, value) {
  if (typeof value === 'string' || value instanceof String || (0, _isNumber2.default)(value)) {
    return "".concat(key, "=").concat(value);
  }
  if (typeof value[0] === 'string' || value[0] instanceof String) {
    return "".concat(key, "=").concat(value.join(':'));
  }
  if (value && typeof value.toString === 'function') {
    return "".concat(key, "=").concat(value.toString());
  }
  return value.map(function (val) {
    return arrayToStr(key, val);
  });
}
function pickQueryParams(obj) {
  return ['where', 'orderBy', 'limit', 'startAfter', 'startAt', 'endAt', 'endBefore'].reduce(function (acc, key) {
    return obj[key] ? _objectSpread(_objectSpread({}, acc), {}, _defineProperty({}, key, obj[key])) : acc;
  }, {});
}
function serialize(queryParams) {
  return Object.keys(queryParams).filter(function (key) {
    return queryParams[key] !== undefined;
  }).map(function (key) {
    return arrayToStr(key, queryParams[key]);
  }).join('&');
}
function getQueryName(meta) {
  if (typeof meta === 'string' || meta instanceof String) {
    return meta;
  }
  var path = meta.path,
    collection = meta.collection,
    collectionGroup = meta.collectionGroup,
    id = meta.id,
    doc = meta.doc,
    subcollections = meta.subcollections,
    storeAs = meta.storeAs,
    remainingMeta = _objectWithoutProperties(meta, _excluded);
  if (!path && !collection && !collectionGroup) {
    throw new Error('Collection or Collection Group is required to build query name');
  }
  if (storeAs) {
    return storeAs;
  }
  var basePath = path || collection || collectionGroup;
  if (id || doc) {
    basePath = basePath.concat("/".concat(id || doc));
  }
  if ((path || collection) && subcollections) {
    console.error('Queries with subcollections must use "storeAs" to prevent invalid store updates. This closley matches the upcoming major release (v1), which stores subcollections at the top level by default.');
    var mappedCollections = subcollections.map(function (subcollection) {
      return getQueryName(subcollection);
    });
    basePath = "".concat(basePath, "/").concat(mappedCollections.join('/'));
  }
  var queryParams = pickQueryParams(remainingMeta);
  if (!(0, _isEmpty2.default)(queryParams)) {
    if (queryParams.where && !Array.isArray(queryParams.where)) {
      throw new Error('where parameter must be an array.');
    }
    basePath = basePath.concat('?', serialize(queryParams));
  }
  return basePath;
}
function getBaseQueryName(meta) {
  if (typeof meta === 'string' || meta instanceof String) {
    return meta;
  }
  var path = meta.path,
    collection = meta.collection,
    collectionGroup = meta.collectionGroup,
    subcollections = meta.subcollections,
    remainingMeta = _objectWithoutProperties(meta, _excluded2);
  if (!path && !collection && !collectionGroup) {
    throw new Error('Collection or Collection Group is required to build query name');
  }
  var basePath = path || collection || collectionGroup;
  if ((path || collection) && subcollections) {
    var mappedCollections = subcollections.map(function (subcollection) {
      return getQueryName(subcollection);
    });
    basePath = "".concat(basePath, "/").concat(mappedCollections.join('/'));
  }
  var queryParams = pickQueryParams(remainingMeta);
  if (!(0, _isEmpty2.default)(queryParams)) {
    if (queryParams.where && !Array.isArray(queryParams.where)) {
      throw new Error('where parameter must be an array.');
    }
    basePath = basePath.concat('?', serialize(queryParams));
  }
  return basePath;
}
function confirmMetaAndConfig(firebase, meta) {
  if (!meta) {
    throw new Error('Meta data is required to attach listener.');
  }
  if (!firebase || !firebase._ || !firebase._.listeners) {
    throw new Error('Internal Firebase object required to attach listener. Confirm that reduxFirestore enhancer was added when you were creating your store');
  }
}
function listenerExists(firebase, meta) {
  confirmMetaAndConfig(firebase, meta);
  var name = getQueryName(meta);
  return !!firebase._.listeners[name];
}
function attachListener(firebase, dispatch, meta, unsubscribe) {
  confirmMetaAndConfig(firebase, meta);
  var name = getQueryName(meta);
  if (!firebase._.listeners[name]) {
    firebase._.listeners[name] = unsubscribe;
  }
  dispatch({
    type: _constants.actionTypes.SET_LISTENER,
    meta: meta,
    payload: {
      name: name
    }
  });
  return firebase._.listeners;
}
function detachListener(firebase, dispatch, meta) {
  var name = getQueryName(meta);
  if (firebase._.listeners[name]) {
    firebase._.listeners[name]();
    delete firebase._.listeners[name];
  }
  var _ref0 = firebase._.config || {},
    preserveCache = _ref0.preserveCacheAfterUnset;
  dispatch({
    type: _constants.actionTypes.UNSET_LISTENER,
    meta: meta,
    payload: {
      name: name,
      preserveCache: preserveCache
    }
  });
}
function queryStrToObj(queryPathStr, parsedPath) {
  var pathArr = parsedPath || (0, _trim2.default)(queryPathStr, ['/']).split('/');
  var _pathArr = _toArray(pathArr),
    collection = _pathArr[0],
    doc = _pathArr[1],
    subcollections = _pathArr.slice(2);
  var queryObj = {};
  if (collection) queryObj.collection = collection;
  if (doc) queryObj.doc = doc;
  if (subcollections.length) {
    queryObj.subcollections = [queryStrToObj('', subcollections)];
  }
  return queryObj;
}
function getQueryConfig(query) {
  if (typeof query === 'string' || query instanceof String) {
    return queryStrToObj(query);
  }
  if ((0, _isObject2.default)(query)) {
    if (!query.collection && !query.collectionGroup && !query.doc) {
      throw new Error('Collection, Collection Group and/or Doc are required parameters within query definition object.');
    }
    return query;
  }
  throw new Error('Invalid Path Definition: Only Strings and Objects are accepted.');
}
function getQueryConfigs(queries) {
  if (Array.isArray(queries)) {
    return queries.map(getQueryConfig);
  }
  if (typeof queries === 'string' || queries instanceof String) {
    return queryStrToObj(queries);
  }
  if ((0, _isObject2.default)(queries)) {
    return [getQueryConfig(queries)];
  }
  throw new Error('Querie(s) must be an Array or a string.');
}
function orderedFromSnap(snap) {
  var ordered = [];
  if (snap.data && snap.exists) {
    var id = snap.id,
      path = snap.ref.parent.path;
    var obj = (0, _isObject2.default)(snap.data()) ? _objectSpread(_objectSpread({}, snap.data() || snap.data), {}, {
      id: id,
      path: path
    }) : {
      id: id,
      path: path,
      data: snap.data()
    };
    snapshotCache.set(obj, snap);
    ordered.push(obj);
  } else if (snap.forEach) {
    snap.forEach(function (doc) {
      var id = doc.id,
        path = doc.ref.parent.path;
      var obj = (0, _isObject2.default)(doc.data()) ? _objectSpread(_objectSpread({}, doc.data() || doc.data), {}, {
        id: id,
        path: path
      }) : {
        id: id,
        path: path,
        data: doc.data()
      };
      snapshotCache.set(obj, doc);
      ordered.push(obj);
    });
  }
  snapshotCache.set(ordered, snap);
  return ordered;
}
function dataByIdSnapshot(snap) {
  var data = {};
  if (snap.data) {
    var snapData = snap.exists ? snap.data() : null;
    if (snapData) {
      snapshotCache.set(snapData, snap);
      data[snap.id] = _objectSpread(_objectSpread({}, snapData), {}, {
        id: snap.id,
        path: snap.ref.parent.path
      });
    } else {
      data[snap.id] = null;
    }
  } else if (snap.forEach) {
    snap.forEach(function (doc) {
      var snapData = doc.data() || doc;
      snapshotCache.set(snapData, doc);
      data[doc.id] = _objectSpread(_objectSpread({}, snapData), {}, {
        id: doc.id,
        path: doc.ref.parent.path
      });
    });
  }
  if (!!data && Object.keys(data).length) {
    snapshotCache.set(data, snap);
    return data;
  }
  return null;
}
function getPopulateChild(firebase, populate, id) {
  return firestoreRef(firebase, {
    collection: populate.root,
    doc: id
  }).get().then(function (snap) {
    return _objectSpread({
      id: id
    }, snap.data());
  });
}
function populateList(firebase, originalObj, p, results) {
  if (!results[p.root]) {
    (0, _set2.default)(results, p.root, {});
  }
  return Promise.all((0, _map2.default)(originalObj, function (id, childKey) {
    var populateKey = id === true || p.populateByKey ? childKey : id;
    return getPopulateChild(firebase, p, populateKey).then(function (pc) {
      if (pc) {
        return (0, _set2.default)(results, "".concat(p.root, ".").concat(populateKey), pc);
      }
      return results;
    });
  }));
}
function getPopulateObj(str) {
  if (typeof str === 'string' || str instanceof String) {
    return str;
  }
  var strArray = str.split(':');
  return {
    child: strArray[0],
    root: strArray[1]
  };
}
function getPopulateObjs(arr) {
  if (!Array.isArray(arr)) {
    return arr;
  }
  return arr.map(function (o) {
    return (0, _isObject2.default)(o) ? o : getPopulateObj(o);
  });
}
function promisesForPopulate(firebase, dataKey, originalData, populatesIn) {
  var promisesArray = [];
  var results = {};
  var populatesForData = getPopulateObjs(typeof populatesIn === 'function' ? populatesIn(dataKey, originalData) : populatesIn);
  var dataHasPopulateChilds = populatesForData.some(function (populate) {
    return (0, _has2.default)(originalData, populate.child);
  });
  if (dataHasPopulateChilds) {
    populatesForData.forEach(function (p) {
      var childDataVal = (0, _get2.default)(originalData, p.child);
      if (typeof childDataVal === 'string' || childDataVal instanceof String) {
        return promisesArray.push(getPopulateChild(firebase, p, childDataVal).then(function (v) {
          if (v) {
            (0, _set2.default)(results, "".concat(p.storeAs ? p.storeAs : p.root, ".").concat(childDataVal), v);
          }
        }));
      }
      return promisesArray.push(populateList(firebase, childDataVal, p, results));
    });
  } else {
    (0, _forEach2.default)(originalData, function (d, key) {
      var populatesForDataItem = getPopulateObjs(typeof populatesIn === 'function' ? populatesIn(key, d) : populatesIn);
      (0, _forEach2.default)(populatesForDataItem, function (p) {
        var idOrList = (0, _get2.default)(d, p.child);
        if (!idOrList) {
          return;
        }
        if (typeof idOrList === 'string' || idOrList instanceof String) {
          return promisesArray.push(getPopulateChild(firebase, p, idOrList).then(function (v) {
            if (v) {
              (0, _set2.default)(results, "".concat(p.storeAs ? p.storeAs : p.root, ".").concat(idOrList), v);
            }
            return results;
          }));
        }
        if (Array.isArray(idOrList) || (0, _isObject2.default)(idOrList)) {
          return promisesArray.push(populateList(firebase, idOrList, p, results));
        }
      });
    });
  }
  return Promise.all(promisesArray).then(function () {
    return results;
  });
}
var changeTypeToEventType = {
  added: _constants.actionTypes.DOCUMENT_ADDED,
  removed: _constants.actionTypes.DOCUMENT_REMOVED,
  modified: _constants.actionTypes.DOCUMENT_MODIFIED
};
function docChangeEvent(change) {
  var originalMeta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var meta = _objectSpread(_objectSpread({}, (0, _cloneDeep2.default)(originalMeta)), {}, {
    path: change.doc.ref.parent.path
  });
  if (originalMeta.subcollections && !originalMeta.storeAs) {
    meta.subcollections[0] = _objectSpread(_objectSpread({}, meta.subcollections[0]), {}, {
      doc: change.doc.id
    });
  } else {
    meta.doc = change.doc.id;
  }
  var data = _objectSpread({
    id: change.doc.id,
    path: change.doc.ref.parent.path
  }, change.doc.data());
  return {
    type: changeTypeToEventType[change.type] || _constants.actionTypes.DOCUMENT_MODIFIED,
    meta: meta,
    payload: {
      data: data,
      ordered: {
        oldIndex: change.oldIndex,
        newIndex: change.newIndex
      }
    }
  };
}
function dispatchListenerResponse(_ref1) {
  var _docData$metadata;
  var dispatch = _ref1.dispatch,
    docData = _ref1.docData,
    meta = _ref1.meta,
    firebase = _ref1.firebase;
  var _ref10 = firebase._.config || {},
    mergeOrdered = _ref10.mergeOrdered,
    mergeOrderedDocUpdates = _ref10.mergeOrderedDocUpdates,
    mergeOrderedCollectionUpdates = _ref10.mergeOrderedCollectionUpdates;
  var fromCache = typeof ((_docData$metadata = docData.metadata) === null || _docData$metadata === void 0 ? void 0 : _docData$metadata.fromCache) === 'boolean' ? docData.metadata.fromCache : true;
  var docChanges = typeof docData.docChanges === 'function' ? docData.docChanges() : docData.docChanges;
  if (docChanges && docChanges.length < docData.size) {
    docChanges.forEach(function (change, index) {
      var lastChange = index === docChanges.length - 1;
      dispatch(docChangeEvent(change, _objectSpread({
        reprocess: lastChange
      }, meta)));
    });
  } else {
    dispatch({
      type: _constants.actionTypes.LISTENER_RESPONSE,
      meta: meta,
      payload: {
        data: dataByIdSnapshot(docData),
        ordered: orderedFromSnap(docData),
        fromCache: fromCache
      },
      merge: {
        docs: mergeOrdered && mergeOrderedDocUpdates,
        collections: mergeOrdered && mergeOrderedCollectionUpdates
      }
    });
  }
}
function getPopulateActions(_ref11) {
  var firebase = _ref11.firebase,
    docData = _ref11.docData,
    meta = _ref11.meta;
  return promisesForPopulate(firebase, docData.id, dataByIdSnapshot(docData), meta.populates).then(function (populateResults) {
    return (Object.keys(populateResults).map(function (resultKey) {
        return {
          meta: {
            collection: resultKey
          },
          payload: {
            data: populateResults[resultKey]
          },
          requesting: false,
          requested: true
        };
      })
    );
  }).catch(function (populateErr) {
    console.error('Error with populate:', populateErr, meta);
    return Promise.reject(populateErr);
  });
}
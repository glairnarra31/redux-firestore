import { chunk, cloneDeep, flatten, mapValues } from 'lodash';
import { firestoreRef } from './query';

/**
 * Get the Firestore instance from firebase object.
 * Supports both the old namespaced API (firebase.firestore()) and
 * the new modular API (firebase as the firestore instance itself).
 * @param {object} firebase - Firebase/Firestore object
 * @returns {object} Firestore instance or null if invalid
 */
function getFirestoreInstance(firebase) {
  // If firebase has a firestore method (old namespaced API or web SDK)
  if (firebase && typeof firebase.firestore === 'function') {
    return firebase.firestore();
  }
  // If firebase is the firestore instance itself (new modular API)
  // Check for collection method as a signature of firestore instance
  if (firebase && typeof firebase.collection === 'function') {
    return firebase;
  }
  // Return null for invalid/empty objects to maintain backward compatibility
  // The original error will be thrown when methods are called on null/undefined
  return null;
}

const promiseAllObject = async (object) =>
  Object.fromEntries(
    await Promise.all(
      Object.entries(object).map(([key, promise]) =>
        promise.then((value) => [key, value]),
      ),
    ),
  );

const isDocRead = ({ doc, id } = {}) =>
  typeof id === 'string' || typeof doc === 'string';

const hasNothing = (snapshot) =>
  !snapshot ||
  (snapshot.empty && snapshot.empty()) ||
  (snapshot.exists && snapshot.exists());

// ----- FieldValue support -----

const primaryValue = (arr) =>
  Array.isArray(arr) && typeof arr[0] === 'string' && arr[0].indexOf('::') === 0
    ? null
    : arr;

const arrayUnion = (firebase, key, ...val) => {
  if (key !== '::arrayUnion') return null;
  return firebase.firestore.FieldValue.arrayUnion(...val);
};

const arrayRemove = (firebase, key, ...val) => {
  if (key !== '::arrayRemove') return null;
  return firebase.firestore.FieldValue.arrayRemove(...val);
};

const increment = (firebase, key, val) =>
  key === '::increment' &&
  typeof val === 'number' &&
  firebase.firestore.FieldValue.increment(val);

const serverTimestamp = (firebase, key) =>
  key === '::serverTimestamp' &&
  firebase.firestore.FieldValue.serverTimestamp();

/**
 * Process Mutation to a vanilla JSON
 * @param {object} firebase - firebase
 * @param {*} operation - payload mutation
 * @returns {Array} Array of objects
 */
function atomize(firebase, operation) {
  let requiresUpdate = false;
  return [
    Object.keys(operation).reduce((data, key) => {
      const clone = { ...data };
      const val = clone[key];
      if (key.includes('.')) {
        requiresUpdate = true;
      }
      if (!val) return clone;

      const value =
        primaryValue(val) ||
        serverTimestamp(firebase, val[0]) ||
        arrayUnion(firebase, val[0], val[1]) ||
        arrayRemove(firebase, val[0], val[1]) ||
        increment(firebase, val[0], val[1]);

      if (Array.isArray(val) && val.length > 0) {
        // eslint-disable-next-line no-param-reassign
        clone[key] = value;
      }
      return clone;
    }, cloneDeep(operation)),
    requiresUpdate,
  ];
}

// ----- write functions -----

/**
 * For details between set & udpate see:
 * https://firebase.google.com/docs/reference/js/firebase.firestore.Transaction#update
 * @param {object} firebase - Firebase instance
 * @param {Mutation_v1 | Mutation_v2} operation - Operation object
 * @param {firestore.batch | firestore.Transaction} writer - Writer object
 * @returns {Promise | firestore.Doc} - Batch & Transaction .set returns null
 */
function write(firebase, operation = {}, writer = null) {
  const { collection, path, doc, id, data, ...rest } = operation;
  const firestoreInstance = getFirestoreInstance(firebase);
  const ref = firestoreInstance.doc(`${path || collection}/${id || doc}`);
  const [changes, requiresUpdate = false] = atomize(firebase, data || rest);

  if (writer) {
    if (requiresUpdate) {
      writer.update(ref, changes);
    } else {
      writer.set(ref, changes, { merge: true });
    }
    return { id: ref.id, path: ref.parent.path, ...changes };
  }
  if (requiresUpdate) {
    return ref.update(changes);
  }

  return ref.set(changes, { merge: true });
}

/**
 * @param {object} firebase - Firebase instance
 * @param {object} operations - Operations
 * @returns {Promise} Resolves with results of write
 */
function writeSingle(firebase, operations) {
  const promise = write(firebase, operations);
  return promise;
}

const MAX_BATCH_COUNT = 500;

/**
 * @param {object} firebase - Firebase instance
 * @param {object} operations - Operations
 * @returns {Promise} Resolves with results of writing in batch
 */
async function writeInBatch(firebase, operations) {
  const firestoreInstance = getFirestoreInstance(firebase);
  const committedBatchesPromised = chunk(operations, MAX_BATCH_COUNT).map(
    (operationsChunk) => {
      const batch = firestoreInstance.batch();
      const writesBatched = operationsChunk.map((operation) =>
        write(firebase, operation, batch),
      );

      return batch.commit().then(() => writesBatched);
    },
  );

  return Promise.all(committedBatchesPromised).then(flatten);
}

/**
 * @param {object} firebase - Firebase instance
 * @param {object} operations - Operations
 * @returns {Promise} Resolves with results of running transaction
 */
async function writeInTransaction(firebase, operations) {
  const firestoreInstance = getFirestoreInstance(firebase);
  return firestoreInstance.runTransaction(async (transaction) => {
    const serialize = (doc) =>
      !doc
        ? null
        : { ...doc.data(), id: doc.ref.id, path: doc.ref.parent.path };

    const readsPromised = mapValues(operations.reads, async (read) => {
      if (typeof read === 'function') return read();

      if (isDocRead(read)) {
        const doc = firestoreRef(firebase, read);
        const snapshot = await transaction.get(doc);
        return serialize(snapshot.exsits === false ? null : snapshot);
      }

      // else query (As of 7/2021, Firestore doesn't include queries in client-side transactions)
      const coll = firestoreRef(firebase, read);
      const snapshot = await coll.get();
      if (hasNothing(snapshot) || snapshot.docs.length === 0) return [];
      const unserializedDocs = await Promise.all(
        snapshot.docs.map((ref) => transaction.get(ref)),
      );
      return unserializedDocs.map(serialize);
    });

    const reads = await promiseAllObject(readsPromised);

    const writes = [];

    operations.writes.forEach((writeFnc) => {
      const operation =
        typeof writeFnc === 'function' ? writeFnc(reads) : writeFnc;

      if (Array.isArray(operation)) {
        operation.map((op) => write(firebase, op, transaction));
        writes.push(operation);
      } else {
        writes.push(write(firebase, operation, transaction));
      }
    });

    // Firestore Transaction return null.
    // Instead we'll return the results of all read data & writes.
    return { reads, writes };
  });
}

/**
 * @param {object} firestore - Firestore instance
 * @param {object} operations - Operations
 * @returns {Promise} Resolves with results of mutation
 */
export default function mutate(firestore, operations) {
  // Is a single write
  if (
    typeof operations?.path === 'string' ||
    typeof operations?.collection === 'string'
  ) {
    return writeSingle(firestore, operations);
  }
  // Is batched write
  if (Array.isArray(operations)) {
    return writeInBatch(firestore, operations);
  }

  return writeInTransaction(firestore, operations);
}

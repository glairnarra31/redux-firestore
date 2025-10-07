import { merge } from 'lodash/fp';
import { firestoreActions } from './actions';
import { mapWithFirebaseAndDispatch } from './utils/actions';
import { defaultConfig, methodsToAddFromFirestore } from './constants';

let firestoreInstance;

/**
 * Get the Firestore instance from firebase object.
 * Supports both the old namespaced API (firebase.firestore()) and
 * the new modular API (firebase as the firestore instance itself).
 * @param {object} firebase - Firebase/Firestore object
 * @returns {object} Firestore instance or null if invalid
 */
export function getFirestoreInstance(firebase) {
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

/**
 * Create a firebase instance that has helpers attached for dispatching actions
 * @param {object} firebase - Firebase instance which to extend
 * @param {object} configs - Configuration object
 * @param {Function} dispatch - Action dispatch function
 * @returns {object} Extended Firebase instance
 */
export default function createFirestoreInstance(firebase, configs, dispatch) {
  // Setup internal variables
  const defaultInternals = {
    // Setup empty listeners object (later used to track listeners)
    listeners: {},
    // Setup empty path listeners count object (later used to track listeners)
    pathListenerCounts: {},
    // Extend default config with provided config
    config: { ...defaultConfig, ...configs },
  };

  // extend existing firebase internals (using redux-firestore along with redux-firebase)
  firebase._ = merge(defaultInternals, firebase._); // eslint-disable-line no-param-reassign

  // Aliases for methods
  const aliases = [
    { action: firestoreActions.deleteRef, name: 'delete' },
    { action: firestoreActions.setListener, name: 'onSnapshot' },
  ];

  // Create methods with internal firebase object and dispatch passed
  const methods = mapWithFirebaseAndDispatch(
    firebase,
    dispatch,
    firestoreActions,
    aliases,
  );

  // Get the actual firestore instance
  const actualFirestoreInstance = getFirestoreInstance(firebase);

  // Only include specific methods from Firestore since other methods
  // are extended (list in constants)
  const methodsFromFirestore = methodsToAddFromFirestore.reduce(
    (acc, methodName) =>
      actualFirestoreInstance &&
      typeof actualFirestoreInstance[methodName] === 'function'
        ? {
            ...acc,
            [methodName]: actualFirestoreInstance[methodName].bind(
              actualFirestoreInstance,
            ),
          }
        : acc,
    {},
  );

  // Store the firestore instance getter for internal use
  // This allows both old and new API to work
  const firestoreGetter =
    typeof firebase.firestore === 'function'
      ? firebase.firestore
      : () => actualFirestoreInstance;

  firestoreInstance = Object.assign(
    methodsFromFirestore,
    firestoreGetter,
    { _: firebase._ },
    configs.helpersNamespace
      ? // Attach helpers to specified namespace
        { [configs.helpersNamespace]: methods }
      : methods,
  );

  return firestoreInstance;
}

/**
 * Expose Firestore instance created internally. Useful for
 * integrations into external libraries such as redux-thunk and redux-observable.
 * @returns {object} Firebase Instance
 * @example <caption>redux-thunk integration</caption>
 * import { applyMiddleware, compose, createStore } from 'redux';
 * import thunk from 'redux-thunk';
 * import makeRootReducer from './reducers';
 * import { reduxFirestore, getFirestore } from 'redux-firestore';
 *
 * const fbConfig = {} // your firebase config
 *
 * const store = createStore(
 *   makeRootReducer(),
 *   initialState,
 *   compose(
 *     applyMiddleware([
 *       // Pass getFirestore function as extra argument
 *       thunk.withExtraArgument(getFirestore)
 *     ]),
 *     reduxFirestore(fbConfig)
 *   )
 * );
 * // then later
 * export const addTodo = (newTodo) =>
 *  (dispatch, getState, getFirestore) => {
 *    const firestore = getFirestore()
 *    firestore
 *      .add('todos', newTodo)
 *      .then(() => {
 *        dispatch({ type: 'SOME_ACTION' })
 *      })
 * };
 */
export function getFirestore() {
  /* istanbul ignore next: Firestore instance always exists during tests */
  if (!firestoreInstance) {
    throw new Error('Firestore instance does not yet exist. Check your setup.');
  }
  return firestoreInstance;
}

# Migration Guide: React Native Firebase v22 Support

## Summary

This fork has been updated to support React Native Firebase v22's modular API while maintaining backward compatibility with the legacy namespaced API.

## What Changed

### Core Changes

1. **Added `getFirestoreInstance()` helper function** - A utility that detects and handles both API styles:
   - Legacy: `firebase.firestore()` (returns firestore instance from method call)
   - Modular: Direct firestore instance (checks for `collection` method)

2. **Updated all internal firestore access** in:
   - `src/createFirestoreInstance.js`
   - `src/utils/query.js`
   - `src/utils/mutate.js`
   - `src/actions/firestore.js`

3. **Exported new helper** - `getFirestoreInstance` is now exported from the main package for users who need it

### Files Modified

- `src/createFirestoreInstance.js` - Added compatibility layer
- `src/utils/query.js` - Updated `firestoreRef()` function
- `src/utils/mutate.js` - Updated `write()`, `writeInBatch()`, and `writeInTransaction()`
- `src/actions/firestore.js` - Updated `runTransaction()`
- `src/index.js` - Exported new helper function
- `README.md` - Added React Native support notice
- `docs/react-native-firebase.md` - New comprehensive guide

## How to Use

### For React Native Firebase v22+ (Modular API)

```javascript
import { createStore, combineReducers, compose } from 'redux';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firestore from '@react-native-firebase/firestore';

// Simply pass the firestore instance directly
const firestoreInstance = firestore();

const store = createStore(
  combineReducers({ firestore: firestoreReducer }),
  compose(reduxFirestore(firestoreInstance, {}))
);
```

### For Legacy API (< v22)

```javascript
import { createStore, combineReducers, compose } from 'redux';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firestore from '@react-native-firebase/firestore';

// Create wrapper with firestore method
const firebase = {
  firestore: () => firestore(),
};

const store = createStore(
  combineReducers({ firestore: firestoreReducer }),
  compose(reduxFirestore(firebase, {}))
);
```

## Backward Compatibility

✅ **100% backward compatible** - All existing code continues to work
✅ **All tests pass** - 238 tests passing
✅ **Web SDK support** - Firebase web SDK still works as before
✅ **No breaking changes** - Existing implementations remain unchanged

## Migration Path

If you're using React Native Firebase and getting deprecation warnings:

1. Update to React Native Firebase v22+
2. Change your initialization from:
   ```javascript
   const firebase = { firestore: () => firestore() };
   ```
   To:
   ```javascript
   const firestoreInstance = firestore();
   ```
3. Pass the instance directly to `reduxFirestore()`

That's it! No other code changes needed.

## Technical Details

The `getFirestoreInstance()` helper function checks for:
1. A `firestore()` method (legacy/web SDK)
2. A `collection()` method (modular API signature)
3. Returns null for invalid objects (maintaining original error behavior)

This approach ensures:
- No runtime overhead for valid instances
- Original error messages preserved for invalid usage
- Both API styles work seamlessly
- Future-proof for additional Firebase implementations

## Documentation

See [docs/react-native-firebase.md](./docs/react-native-firebase.md) for:
- Complete setup examples
- Migration instructions
- Troubleshooting guide
- TypeScript support details

## Testing

All changes have been tested with:
- ✅ Unit tests (238 passing)
- ✅ Build verification (CommonJS, ES, UMD)
- ✅ Backward compatibility checks

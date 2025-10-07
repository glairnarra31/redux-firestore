# React Native Firebase Integration

This guide explains how to use redux-firestore with React Native Firebase, including support for both the legacy namespaced API and the new modular API (v22+).

## Overview

redux-firestore now supports both:
- **Legacy Namespaced API** (React Native Firebase < v22) - using `firebase.firestore()`
- **Modular API** (React Native Firebase v22+) - passing firestore instance directly

## Installation

```bash
npm install redux-firestore react-redux
npm install @react-native-firebase/app @react-native-firebase/firestore
```

## Setup

### For React Native Firebase v22+ (Modular API)

With v22+, you should pass the firestore instance directly instead of using the deprecated namespaced API:

```javascript
import { createStore, combineReducers, compose } from 'redux';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firestore from '@react-native-firebase/firestore';

// Get the firestore instance (no need to call it as a function)
const firestoreInstance = firestore();

// Configure redux-firestore
const rfConfig = {
  // your config options
};

// Create store with firestore enhancer
const createStoreWithFirebase = compose(
  reduxFirestore(firestoreInstance, rfConfig)
)(createStore);

// Add firestore reducer
const rootReducer = combineReducers({
  firestore: firestoreReducer,
});

// Create store
const initialState = {};
const store = createStoreWithFirebase(rootReducer, initialState);

export default store;
```

### For React Native Firebase < v22 (Legacy Namespaced API)

If you're still using the older version with the namespaced API:

```javascript
import { createStore, combineReducers, compose } from 'redux';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';
import firestore from '@react-native-firebase/firestore';

// Create a firebase-like wrapper (legacy approach)
const firebase = {
  firestore: () => firestore(),
};

const rfConfig = {};

const createStoreWithFirebase = compose(
  reduxFirestore(firebase, rfConfig)
)(createStore);

const rootReducer = combineReducers({
  firestore: firestoreReducer,
});

const store = createStoreWithFirebase(rootReducer, {});

export default store;
```

## Usage in Components

Once configured, you can use redux-firestore hooks and HOCs as documented:

### With Hooks

```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { useFirestoreConnect } from 'react-redux-firebase';

const MyComponent = () => {
  // Attach listener
  useFirestoreConnect([
    { collection: 'todos' }
  ]);

  // Get data from redux
  const todos = useSelector(state => state.firestore.data.todos);

  return (
    <View>
      {todos && Object.values(todos).map(todo => (
        <Text key={todo.id}>{todo.title}</Text>
      ))}
    </View>
  );
};

export default MyComponent;
```

### With HOC

```javascript
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

const MyComponent = ({ todos }) => (
  <View>
    {todos && todos.map(todo => (
      <Text key={todo.id}>{todo.title}</Text>
    ))}
  </View>
);

export default compose(
  firestoreConnect([
    { collection: 'todos' }
  ]),
  connect((state) => ({
    todos: state.firestore.ordered.todos
  }))
)(MyComponent);
```

## Migration from Namespaced to Modular API

If you're migrating from React Native Firebase < v22 to v22+, you only need to change how you initialize redux-firestore:

**Before (Namespaced API):**
```javascript
import firestore from '@react-native-firebase/firestore';

const firebase = {
  firestore: () => firestore(),
};

reduxFirestore(firebase, config)
```

**After (Modular API):**
```javascript
import firestore from '@react-native-firebase/firestore';

const firestoreInstance = firestore();

reduxFirestore(firestoreInstance, config)
```

## Troubleshooting

### "This method is deprecated" Warning

If you see deprecation warnings about the namespaced API, it means you're using React Native Firebase v22+ but passing a firebase object with a `firestore()` method. Update your initialization code to pass the firestore instance directly as shown above.

### "Invalid firebase instance" Error

This error occurs when redux-firestore cannot determine how to get the firestore instance. Make sure you're passing either:
- A firestore instance directly (for modular API)
- An object with a `firestore()` method (for legacy API)

## Configuration Options

All standard redux-firestore configuration options are supported. See the main documentation for details on:
- Query configuration
- Listener management
- Population
- Optimistic updates
- And more

## TypeScript Support

TypeScript definitions are included and work with both API styles. The library will correctly infer types based on how you initialize it.

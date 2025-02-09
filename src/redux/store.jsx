import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './rootReducer';
import userSaga from './user/Sagas'; // Import saga
import Reducer from "./user/Reducer";

const sagaMiddleware = createSagaMiddleware(); // Create saga middleware

const store = configureStore({
  reducer: Reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),  // Use callback to add saga middleware
});

sagaMiddleware.run(userSaga); // Run the saga

export default store;  // Ensure the store is exported as default

import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './reducers';

export default configureStore({
  reducer: { data: rootReducer },
});

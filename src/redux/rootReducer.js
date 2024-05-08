// rootReducer.js
import { combineReducers } from 'redux';
import authModalReducer from './authModalSlice';

const rootReducer = combineReducers({
    authModal: authModalReducer,
    // other reducers...
});

export default rootReducer;

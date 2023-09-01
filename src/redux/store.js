import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
import { rootReducer } from './rootReducer';

const finalReducer = combineReducers({
    rootReducer,
});

const initialState = {
    rootReducer: {
        cartItems: localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : [],
        totalQuantity: localStorage.getItem("totalQuantity") ? JSON.parse(localStorage.getItem("totalQuantity")) : 0
    },
};

const middleware = [thunk];

const store = createStore(finalReducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
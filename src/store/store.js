import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistCombineReducers} from 'redux-persist';
import storage from 'redux-persist/es/storage';

const config = {
    key: 'config',
    storage,
};

export const configureStore = () => {
    const reducer = persistCombineReducers(config, reducers);
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
    const persistor = persistStore(store);
    return {store, persistor};
};
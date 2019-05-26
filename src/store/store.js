import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist/lib';
import storage from 'redux-persist/es/storage';
import Immutable from 'seamless-immutable';

const persistConfig = {
    key: 'config',
    storage,
};

export const makeError = (payload, type) => {
    return Immutable({
        error: payload.message,
        type
    });
};

export const makeKeyedError = ({payload, type}) => {
    return Immutable({
        [new Date().getTime()]: makeError(payload, type)
    });
};

export const configureStore = () => {
    const {config, ...rest} = reducers;
    const reducer = combineReducers({
        config: persistReducer(persistConfig, config),
        ...rest
    });
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
    const persistor = persistStore(store);
    return {store, persistor};
};
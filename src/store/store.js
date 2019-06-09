import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist/lib';
import Immutable from 'seamless-immutable';

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


const handleStore = (module) => {
    const persistConfig = {
        key: 'config',
        storage: module.default
    };
    const {config, ...rest} = reducers;
    const reducer = combineReducers({
        config: persistReducer(persistConfig, config),
        ...rest
    });
    const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
    const persistor = persistStore(store);
    return {store, persistor};
};

let handler = null;
if (process.env.NODE_ENV === 'test') {
    handler = async () => {
        return import('./noopstore').then(handleStore);
    };
} else {
    handler = async () => {
        return import('redux-persist/es/storage').then(handleStore);
    };
}
export const configureStore = handler;
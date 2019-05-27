import {applyMiddleware, createStore, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist/lib';
import Immutable from 'seamless-immutable';

function noop() {}
const noopStorage = {
    getItem: noop,
    setItem: noop,
    removeItem: noop,
};

const storage = () => {
    if (process.env.NODE_ENV === 'test') {
        return noopStorage;
    } else {
        import('redux-persist/es/storage')
    }
};

const persistConfig = {
    key: 'config',
    storage: storage()
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
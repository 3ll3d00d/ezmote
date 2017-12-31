import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto'
import {Provider} from 'react-redux';
import App from './App';
import {PersistGate} from "redux-persist/es/integration/react";
import {configureStore} from "./store/store";
import './index.css';

// required for react-md
import WebFontLoader from 'webfontloader';
WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
});

const {persistor, store} = configureStore();

ReactDOM.render(
    <PersistGate persistor={persistor}>
        <Provider store={store}>
            <App/>
        </Provider>
    </PersistGate>,
    document.getElementById('root')
);
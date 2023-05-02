import React, {Component} from 'react';
import {Provider} from "react-redux";
import App from "./App";
import {PersistGate} from "redux-persist/lib/integration/react";
import {configureStore} from "./store/store";
import {connectWsToStore} from "./store/jriver/actions";
import {fetchCommands} from "./store/commands/actions";

export default class PersistableApp extends Component {
    state = {
        persistor: null,
        store: null
    };

    loader = async () => {
        const {persistor, store} = await configureStore();
        return {persistor, store};
    };

    componentDidMount = async () => {
        const {persistor, store} = await this.loader();
        connectWsToStore(store);
        store.dispatch(fetchCommands());
        this.setState({persistor, store});
    };

    render() {
        const {persistor, store} = this.state;
        if (persistor) {
            return (
                <PersistGate persistor={persistor}>
                    <Provider store={store}>
                        <App/>
                    </Provider>
                </PersistGate>
            );
        } else {
            return null;
        }
    }
}
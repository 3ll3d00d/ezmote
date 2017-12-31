import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import Config from "./scenes/config";
import Control from "./scenes/control";
import Mode from "./scenes/mode";
import {FullScreenMenu, NotFullScreenMenu} from "./scenes/menu";
import Grid from "material-ui/Grid";
import grey from 'material-ui/colors/grey';
import blueGrey from 'material-ui/colors/blueGrey';
import red from 'material-ui/colors/red';
import Fullscreen from "react-full-screen";
import {connect} from 'react-redux';
import {isAlive, stopServerPoller} from "./store/jriver/actions";
import {getConfig} from "./store/config/reducer";
import {getServerName} from "./store/jriver/reducer";

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: grey,
        secondary: blueGrey,
        error: red
    }
});

class App extends Component {
    state = {
        selected: 'Control',
        fullscreen: false
    };

    componentDidMount = () => {
        this.props.isAlive();
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.config.valid && !this.props.config.valid) {
            this.setState({selected: 'Control'});
        } else if (!nextProps.config.valid) {
            this.setState({selected: 'Settings'});
        }
    };

    componentWillUnmount = () => {
        const {serverName} = this.props;
        if (serverName) {
            stopServerPoller(serverName);
        }
    };

    handleMenuSelect = (selected) => {
        this.setState({selected});
    };

    toggleFullScreen = () => {
        this.setState((prevState, prevProps) => {
            return {fullscreen: !prevState.fullscreen};
        });
    };

    render() {
        const {selected, fullscreen} = this.state;
        const MenuComponent = fullscreen ? FullScreenMenu : NotFullScreenMenu;
        return (
            <Fullscreen enabled={fullscreen}>
                <MuiThemeProvider theme={theme}>
                    <MenuComponent handler={this.handleMenuSelect}
                                   selected={selected}
                                   fullscreen={fullscreen}
                                   toggleFullScreen={this.toggleFullScreen}>
                        <Grid container>
                            <Grid item xs={12}>
                                {'Settings' === selected ? <Config/> : null}
                                {'Control' === selected ? <Control/> : null}
                                {'Source' === selected ? <Mode/> : null}
                            </Grid>
                        </Grid>
                    </MenuComponent>
                </MuiThemeProvider>
            </Fullscreen>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        config: getConfig(state),
        serverName: getServerName(state)
    };
};
export default connect(mapStateToProps, {isAlive})(App);

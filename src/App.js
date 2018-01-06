import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import Config from "./scenes/config";
import Control from "./scenes/control";
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
import {getOrderedCommands} from "./store/commands/reducer";
import {fetchCommands, sendCommand} from "./store/commands/actions";
import {CMDSERVER_PORT} from "./store/config/config";

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
        selected: 'virgin',
        fullscreen: false
    };

    // TODO cmdserver will be the webserver for this app so this isn't really required
    componentDidMount = () => {
        this.props.isAlive();
        if (this.props.config.valid && this.props.config[CMDSERVER_PORT]) {
            this.props.fetchCommands();
        }
    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.config.valid && nextProps.config[CMDSERVER_PORT] && Object.keys(nextProps.commands).length === 0) {
            this.props.fetchCommands();
        }
        if (!nextProps.config.valid) {
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
        const {sendCommand} = this.props;
        if (selected !== 'Settings') {
            sendCommand(selected);
        }
        this.setState({selected});
    };

    toggleFullScreen = () => {
        this.setState((prevState, prevProps) => {
            return {fullscreen: !prevState.fullscreen};
        });
    };

    render() {
        const {commands} = this.props;
        const selectedCommand = commands.find(c => c.id === this.state.selected);
        const searchNodeId = selectedCommand && selectedCommand.hasOwnProperty('nodeId') ? selectedCommand.nodeId : null;
        const {selected, fullscreen} = this.state;
        const MenuComponent = fullscreen ? FullScreenMenu : NotFullScreenMenu;
        return (
            <Fullscreen enabled={fullscreen}>
                <MuiThemeProvider theme={theme}>
                    <MenuComponent handler={this.handleMenuSelect}
                                   selectedTitle={selectedCommand ? selectedCommand.title : selected}
                                   searchNodeId={searchNodeId}
                                   commands={commands}
                                   fullscreen={fullscreen}
                                   toggleFullScreen={this.toggleFullScreen}>
                        <Grid container>
                            <Grid item xs={12}>
                                {'Settings' === selected
                                    ? <Config/>
                                    : <Control selectedCommand={selectedCommand}/>
                                }
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
        serverName: getServerName(state),
        commands: getOrderedCommands(state)
    };
};
export default connect(mapStateToProps, {isAlive, fetchCommands, sendCommand})(App);

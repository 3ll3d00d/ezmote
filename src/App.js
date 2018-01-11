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
import {getActiveZone, getErrors, getServerName, isJRiverDead} from "./store/jriver/reducer";
import {getOrderedCommands} from "./store/commands/reducer";
import {fetchCommands, sendCommand} from "./store/commands/actions";
import TivoChannelSelector from "./scenes/control/tivo/TivoChannelSelector";
import JRiverSelector from "./scenes/control/jriver/JRiverSelector";
import Errors from "./scenes/errors";

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

    componentDidMount = () => {
        this.props.isAlive();
        this.props.fetchCommands();
    };

    componentWillReceiveProps = (nextProps) => {
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

    getSelector = (selectedCommand) => {
        if (selectedCommand && selectedCommand.hasOwnProperty('control')) {
            if (selectedCommand.control === 'jriver') {
                return <JRiverSelector categoryId={selectedCommand.nodeId}/>;
            } else if (selectedCommand.control === 'tivo') {
                return <TivoChannelSelector/>;
            }
        }
        return null;
    };

    render() {
        const {commands, errors, jriverIsDead} = this.props;
        const selectedCommand = commands.find(c => c.id === this.state.selected);
        const {selected, fullscreen} = this.state;
        const MenuComponent = fullscreen ? FullScreenMenu : NotFullScreenMenu;
        return (
            <Fullscreen enabled={fullscreen}>
                <MuiThemeProvider theme={theme}>
                    <MenuComponent handler={this.handleMenuSelect}
                                   selectedTitle={selectedCommand ? selectedCommand.title : selected}
                                   selector={this.getSelector(selectedCommand)}
                                   commands={commands}
                                   fullscreen={fullscreen}
                                   toggleFullScreen={this.toggleFullScreen}>
                        <Grid container>
                            <Grid item xs={12}>
                                {'Settings' === selected
                                    ? <Config/>
                                    : <Control selectedCommand={selectedCommand} jriverIsDead={jriverIsDead}/>
                                }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Errors errors={errors}/>
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
        commands: getOrderedCommands(state),
        zone: getActiveZone(state),
        errors: getErrors(state),
        jriverIsDead: isJRiverDead(state)
    };
};
export default connect(mapStateToProps, {isAlive, fetchCommands, sendCommand})(App);

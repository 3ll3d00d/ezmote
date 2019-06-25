import React, {Component} from 'react';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import Config from "./scenes/config";
import Control from "./scenes/control";
import PJ from "./scenes/control/pj";
import {FullScreenMenu, NotFullScreenMenu} from "./scenes/menu";
import Grid from '@material-ui/core/Grid';
import grey from '@material-ui/core/colors/grey';
import blueGrey from '@material-ui/core/colors/blueGrey';
import red from '@material-ui/core/colors/red';
import CssBaseline from '@material-ui/core/CssBaseline';
import Fullscreen from "react-full-screen";
import {connect} from 'react-redux';
import {isAlive, stopAllPlaying, stopAllPollers} from "./store/jriver/actions";
import {getConfig} from "./store/config/reducer";
import {getErrors, getServerName, isJRiverDead} from "./store/jriver/reducer";
import {getOrderedCommands} from "./store/commands/reducer";
import {fetchCommands, sendCommand} from "./store/commands/actions";
import TivoChannelSelector from "./scenes/control/tivo/TivoChannelSelector";
import Errors from "./scenes/errors";
import {getPlayingNow} from "./store/playingnow/reducer";
import debounce from 'lodash.debounce';

const theme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: grey,
        secondary: blueGrey,
        error: red,
    }
});

export const SETTINGS = 'Settings';
export const SHOW_PJ = 'PJ';

class App extends Component {
    // TODO move into the store
    state = {
        hasSelected: false,
        selected: SETTINGS,
        fullscreen: false,
        showPj: false
    };

    componentDidMount = () => {
        if (this.props.config.valid) {
            this.props.isAlive();
        }
        this.props.fetchCommands();
    };

    doIsAlive = () => {
        console.log("Initialising alive calls on config validation");
        this.props.isAlive();
    };

    debounceIsAlive = debounce(this.doIsAlive, 1000, {leading:false, trailing:true});

    componentWillReceiveProps = (nextProps) => {
        if (!nextProps.config.valid) {
            this.setState({selected: SETTINGS, hasSelected: false});
        } else if (nextProps.config.valid && !this.props.config.valid) {
            this.debounceIsAlive();
        } else if (!this.state.hasSelected && nextProps.config.valid) {
            const {commands, playingNow} = nextProps;
            const playingNowCommand = (playingNow && playingNow !== "") ? commands.find(c => c && c.title === playingNow) : null;
            if (playingNowCommand) {
                this.setState({selected: playingNowCommand.id, hasSelected: false});
            }
        }
    };

    componentWillUnmount = () => {
        stopAllPollers();
    };

    handleMenuSelect = (selected) => {
        const {sendCommand} = this.props;
        if (typeof selected === 'string') {
            if (selected === SHOW_PJ) {
                this.setState((prevState, prevProps) => {
                    return {showPj: !prevState.showPj}
                });
            } else {
                this.setState({selected: selected, hasSelected: true});
            }
        } else {
            if (selected.hasOwnProperty('control') && selected.control === 'jriver') {
                // only send the command when we select something to play
            } else {
                sendCommand(selected);
            }
            this.setState({selected: selected.id, hasSelected: true});
        }
    };

    toggleFullScreen = () => {
        this.setState((prevState, prevProps) => {
            return {fullscreen: !prevState.fullscreen};
        });
    };

    showTheatreView = () => {
        const {sendCommand, commands} = this.props;
        sendCommand(commands.find(c => c.control === 'jriver'));
    };

    getSelector = (selectedCommand) => {
        if (selectedCommand && selectedCommand.hasOwnProperty('control')) {
            if (selectedCommand.control === 'tivo') {
                return <TivoChannelSelector/>;
            }
        }
        return null;
    };

    getMainComponent = (selected, selectedCommand, playingNowCommand) => {
        if (selected === SETTINGS) {
            return <Config/>
        } else {
            if (playingNowCommand || selectedCommand.control === 'jriver') {
                return <Control playingNowCommand={playingNowCommand}
                                selectedCommand={selectedCommand}
                                jriverIsDead={this.props.jriverIsDead}/>;
            } else {
                return <Config/>
            }
        }
    };

    render() {
        const {commands, errors, playingNow} = this.props;
        const playingNowCommand = playingNow ? commands.find(c => c && c.title === playingNow) : null;
        const {selected, fullscreen, showPj} = this.state;
        const selectedCommand = selected !== SETTINGS ? commands.find(c => c && c.id === selected) : null;
        const selectorTitle = selected === SETTINGS ? SETTINGS : selectedCommand ? selectedCommand.title : null;
        const MenuComponent = fullscreen ? FullScreenMenu : NotFullScreenMenu;
        return (
            <Fullscreen enabled={fullscreen}>
                <MuiThemeProvider theme={theme}>
                    <CssBaseline />
                    <MenuComponent handler={this.handleMenuSelect}
                                   selectorTitle={selectorTitle}
                                   selectedCommand={selectedCommand}
                                   commands={commands}
                                   fullscreen={fullscreen}
                                   toggleFullScreen={this.toggleFullScreen}
                                   showTheatreView={this.showTheatreView}>
                        {
                            showPj
                                ?
                                <Grid container>
                                    <Grid item xs={12}>
                                        <PJ/>
                                    </Grid>
                                </Grid>
                                : null
                        }
                        <Grid container>
                            <Grid item xs={12}>{this.getMainComponent(selected, selectedCommand, playingNowCommand)}</Grid>
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
        errors: getErrors(state),
        jriverIsDead: isJRiverDead(state),
        playingNow: getPlayingNow(state)
    };
};
export default connect(mapStateToProps, {isAlive, fetchCommands, sendCommand, stopAllPlaying})(App);

import React, {useEffect, useState} from 'react';
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
import {FullScreen, useFullScreenHandle} from "react-full-screen";
import {connect} from 'react-redux';
import {stopAllPlaying} from "./store/jriver/actions";
import {getActiveCommand, getErrors, isJRiverDead} from "./store/jriver/reducer";
import {getOrderedCommands} from "./store/commands/reducer";
import {sendCommand} from "./store/commands/actions";
import Errors from "./scenes/errors";

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

const App = ({commands, activeCommand, sendCommand, jriverIsDead, errors}) => {
    const [hasSelected, setHasSelected] = useState(false);
    const [selected, setSelected] = useState(SETTINGS);
    const [showPj, setShowPj] = useState(false);
    useEffect(() => {
        if (!hasSelected) {
            const playingNowCommand = (activeCommand && activeCommand !== "") ? commands.find(c => c && c.title === activeCommand) : null;
            if (playingNowCommand && playingNowCommand.id !== selected) {
                setSelected(playingNowCommand.id);
                setHasSelected(false);
            }
        }
    }, [hasSelected, setSelected, setHasSelected, activeCommand, commands]);

    const handleMenuSelect = (selected) => {
        if (typeof selected === 'string') {
            if (selected === SHOW_PJ) {
                setShowPj(!showPj);
            } else {
                setSelected(selected);
                setHasSelected(true);
            }
        } else {
            if (selected.hasOwnProperty('control') && selected.control === 'jriver') {
                // only send the command when we select something to play
            } else {
                sendCommand(selected);
            }
            setSelected(selected.id);
            setHasSelected(true);
        }
    };

    const showTheatreView = () => {
        sendCommand(commands.find(c => c.control === 'jriver'));
    };

    const getMainComponent = (selected, selectedCommand, playingNowCommand) => {
        if (selected === SETTINGS) {
            return <Config/>
        } else {
            if (playingNowCommand || selectedCommand.control === 'jriver') {
                return <Control playingNowCommand={playingNowCommand}
                                selectedCommand={selectedCommand}
                                jriverIsDead={jriverIsDead}/>;
            } else {
                return <Config/>
            }
        }
    };

    const playingNowCommand = activeCommand ? commands.find(c => c && c.title === activeCommand) : null;
    const selectedCommand = selected !== SETTINGS ? commands.find(c => c && c.id === selected) : null;
    const selectorTitle = selected === SETTINGS ? SETTINGS : selectedCommand ? selectedCommand.title : null;
    const fsHandle = useFullScreenHandle();
    const MenuComponent = fsHandle.active ? FullScreenMenu : NotFullScreenMenu;
    return (
        <FullScreen handle={fsHandle}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline/>
                <MenuComponent handler={handleMenuSelect}
                               selectorTitle={selectorTitle}
                               selectedCommand={selectedCommand}
                               commands={commands}
                               fullscreen={fsHandle.active}
                               toggleFullScreen={() => fsHandle.active ? fsHandle.exit() : fsHandle.enter()}
                               showTheatreView={showTheatreView}>
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
                        <Grid item xs={12}>{getMainComponent(selected, selectedCommand, playingNowCommand)}</Grid>
                    </Grid>
                    <Grid container>
                        <Grid item>
                            <Errors errors={errors}/>
                        </Grid>
                    </Grid>
                </MenuComponent>
            </MuiThemeProvider>
        </FullScreen>
    );
}

const mapStateToProps = (state) => {
    return {
        commands: getOrderedCommands(state),
        errors: getErrors(state),
        jriverIsDead: isJRiverDead(state),
        activeCommand: getActiveCommand(state)
    };
};
export default connect(mapStateToProps, {sendCommand, stopAllPlaying})(App);

import React, {Component} from 'react';
import Tabs, {Tab} from 'material-ui/Tabs';
import PlayingNow from "./PlayingNow";
import RemoteControl from "./RemoteControl";
import {getActiveZone, getAuthToken, getPlayingNow} from "../../../store/jriver/reducer";
import {
    playNext,
    playPause,
    playPrevious,
    sendKeyPresses,
    setPosition,
    stopPlaying
} from "../../../store/jriver/actions";
import {connect} from "react-redux";
import {withStyles} from 'material-ui/styles';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 0,
    },
    smallTab: {
        height: '36px'
    },
});

class JRiver extends Component {
    state = {
        value: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {playingNow, authToken, activeZone, playPause, stopPlaying, playNext, playPrevious, sendKeyPresses, setPosition, classes} = this.props;
        return (
            <div className={classes.root}>
                <Tabs fullWidth
                      centered
                      indicatorColor="secondary"
                      textColor="secondary"
                      value={this.state.value}
                      onChange={this.handleChange}>
                    <Tab label="Playing Now" className={classes.smallTab}/>
                    <Tab label="Remote Control" className={classes.smallTab}/>
                </Tabs>
                {
                    this.state.value === 0
                    && playingNow
                    && <PlayingNow controls={{playPause, stopPlaying, playNext, playPrevious, setPosition}}
                                   playingNow={playingNow}
                                   authToken={authToken}
                                   zoneId={activeZone.id}/>
                }
                {this.state.value === 1 && <RemoteControl controls={{sendKeyPresses}}/>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        playingNow: getPlayingNow(state),
        authToken: getAuthToken(state),
        activeZone: getActiveZone(state)
    };
};
export default connect(mapStateToProps, {
    playPause,
    stopPlaying,
    playNext,
    playPrevious,
    setPosition,
    sendKeyPresses
})(withStyles(styles)(JRiver));
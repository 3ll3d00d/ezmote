import React, {Component} from 'react';
import Tabs, {Tab} from 'material-ui/Tabs';
import PlayingNow from "./PlayingNow";
import RemoteControl from "./RemoteControl";
import {getActiveZone, getAuthToken, getPlayingNow} from "../../../store/jriver/reducer";
import {
    playNext, playPause, playPrevious, sendKeyPresses, setPosition,
    stopPlaying
} from "../../../store/jriver/actions";
import {connect} from "react-redux";

class JRiver extends Component {
    state = {
        value: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {playingNow, authToken, activeZone, playPause, stopPlaying, playNext, playPrevious, sendKeyPresses, setPosition} = this.props;
        return (
            <div>
                <Tabs fullWidth
                      indicatorColor="accent"
                      textColor="accent"
                      value={this.state.value}
                      onChange={this.handleChange}>
                    <Tab label="Playing Now"/>
                    <Tab label="Remote Control"/>
                </Tabs>
                {
                    this.state.value === 0
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
})(JRiver);
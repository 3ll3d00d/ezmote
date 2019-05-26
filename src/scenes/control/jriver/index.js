import React, {Component} from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
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
import {withStyles} from '@material-ui/core/styles';
import Browser from "./Browser";

const styles = theme => ({
    root: {
        flexGrow: 1
    },
    smallTab: {
        height: '56px'
    },
});

class JRiver extends Component {
    state = {
        value: -1
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {playingNow, authToken, activeZone, playPause, stopPlaying, playNext, playPrevious, sendKeyPresses, setPosition, classes, selectedCommand} = this.props;
        const {value} = this.state;
        const selectedTab = value === -1 ? (playingNow && playingNow.status !== 'Stopped' ? 1 : 0) : value;
        return (
            <div className={classes.root}>
                <Tabs variant={'fullWidth'}
                      centered={true}
                      indicatorColor="secondary"
                      textColor="secondary"
                      value={selectedTab}
                      onChange={this.handleChange}>
                    <Tab label="Search" className={classes.smallTab}/>
                    <Tab label="Playing Now" className={classes.smallTab}/>
                    <Tab label="Remote Control" className={classes.smallTab}/>
                </Tabs>
                {
                    selectedTab === 0 && <Browser selectedCommand={selectedCommand}
                                                  onPlay={() => this.setState({value: 1})} />
                }
                {
                    selectedTab === 1
                    && playingNow
                    && <PlayingNow controls={{playPause, stopPlaying, playNext, playPrevious, setPosition}}
                                   playingNow={playingNow}
                                   authToken={authToken}
                                   zoneId={activeZone.id}/>
                } 
                {selectedTab === 2 && <RemoteControl controls={{sendKeyPresses}}/>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        playingNow: getPlayingNow(state),
        authToken: getAuthToken(state),
        activeZone: getActiveZone(state),
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
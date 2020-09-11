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
import useMediaQuery from '@material-ui/core/useMediaQuery';

const styles = theme => ({
    portrait: {
        flexGrow: 1
    },
    landscape: {
        display: 'flex',
    },
    smallTab: {
        height: '56px'
    }
});

const VerticalTabs = withStyles(theme => ({
    flexContainer: {
        flexDirection: "column"
    },
    indicator: {
        display: "none"
    },
}))(Tabs);

const OrientedTabs = withStyles(styles)(({selectedTab, handleChange, classes}) => {
    return useMediaQuery('(orientation: landscape) and (min-height: 580px)')
        ?
        <VerticalTabs indicatorColor="secondary"
                      textColor="secondary"
                      value={selectedTab}
                      onChange={handleChange}
                      style={{marginRight: '24px'}}>
            <Tab label="Search"/>
            <Tab label="Playing Now"/>
            <Tab label="Remote"/>
        </VerticalTabs>
        :
        <Tabs variant={'fullWidth'}
              centered={true}
              indicatorColor="secondary"
              textColor="secondary"
              value={selectedTab}
              onChange={handleChange}>
            <Tab label="Search" className={classes.smallTab}/>
            <Tab label="Playing Now" className={classes.smallTab}/>
            <Tab label="Remote" className={classes.smallTab}/>
        </Tabs>;
});

const Container = withStyles(styles)(({classes, children}) => {
    const className = useMediaQuery('(orientation: landscape) and (min-height: 580px)') ? 'landscape' : 'portrait';
    return <div className={classes[className]}>{children}</div>;
});

class JRiver extends Component {
    state = {
        value: -1
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {playingNow, authToken, activeZone, playPause, stopPlaying, playNext, playPrevious, sendKeyPresses, setPosition, selectedCommand} = this.props;
        const {value} = this.state;
        const selectedTab = value === -1 ? (playingNow && playingNow.status !== 'Stopped' ? 1 : 0) : value;
        return (
            <Container>
                <OrientedTabs selectedTab={selectedTab} handleChange={this.handleChange}/>
                {
                    selectedTab === 0
                    &&
                    <Browser selectedCommand={selectedCommand}
                                              onPlay={() => this.setState({value: 1})}/>
                }
                {
                    selectedTab === 1
                    && playingNow
                    &&
                    <PlayingNow controls={{playPause, stopPlaying, playNext, playPrevious, setPosition}}
                                playingNow={playingNow}
                                authToken={authToken}
                                zoneId={activeZone.id}/>
                }
                {
                    selectedTab === 2
                    &&
                    <RemoteControl controls={{sendKeyPresses}}/>
                }
            </Container>
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
})(JRiver);
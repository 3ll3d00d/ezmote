import React, {Component} from 'react';
import _ from "lodash";
import {withStyles} from 'material-ui/styles';
import IconButton from "material-ui/IconButton";
import Grid from "material-ui/Grid";
import ChevronLeft from 'material-ui-icons/ChevronLeft';
import ChevronRight from 'material-ui-icons/ChevronRight';
import VolumeOff from 'material-ui-icons/VolumeOff';
import VolumeUp from 'material-ui-icons/VolumeUp';
import {Slider} from 'react-md';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/jriver/reducer";
import {muteVolume, setVolume, unmuteVolume} from "../../store/jriver/actions";
import {getConfig} from "../../store/config/reducer";

const styles = theme => ({
    padded: {
        marginBottom: '8px'
    },
});

class Volume extends Component {

    tweakVolume = (zoneId, newVolume) => {
        this.props.setVolume(zoneId, newVolume);
    };

    setVolume = zoneId => (value, event) => {
        this.props.setVolume(zoneId, value / 100);
    };

    slowSetVolume = zoneId => _.debounce(this.setVolume(zoneId), 50);

    muteVolume = zoneId => () => {
        this.props.muteVolume(zoneId);
    };

    unmuteVolume = zoneId => () => {
        this.props.unmuteVolume(zoneId);
    };

    makeMuteButton = (zoneId) => {
        const {zone} = this.props;
        if (zone.muted) {
            return <IconButton onClick={this.unmuteVolume(zoneId)}><VolumeUp/></IconButton>;
        } else {
            return <IconButton onClick={this.muteVolume(zoneId)}><VolumeOff/></IconButton>;
        }
    };

    render() {
        const {zone, classes} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio ? Math.round(zone.volumeRatio * 100) : 0;
            return (
                <Grid className={classes.padded} container justify={'space-around'} alignItems={'center'} spacing={8}>
                    <Grid item xs={2}>
                        {this.makeMuteButton(zone.id)}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton disabled={zone.volumeRatio === 0}
                                    onClick={() => this.tweakVolume(zone.id, zone.volumeRatio - 0.01)}>
                            <ChevronLeft/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <Slider id="volume-slider"
                                discrete
                                discreteTicks={20}
                                onChange={this.slowSetVolume(zone.id)}
                                value={currentVolume}/>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton disabled={zone.volumeRatio === 1}
                                    onClick={() => this.tweakVolume(zone.id, zone.volumeRatio + 0.01)}>
                            <ChevronRight/>
                        </IconButton>
                    </Grid>
                </Grid>
            );
        } else {
            return null;
        }
    };
}

const mapStateToProps = (state) => {
    return {
        zone: getActiveZone(state),
        config: getConfig(state)
    };
};
export default connect(mapStateToProps, {
    setVolume,
    muteVolume,
    unmuteVolume
})(withStyles(styles, {withTheme: true})(Volume));
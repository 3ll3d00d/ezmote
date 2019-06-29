import React, {Component} from 'react';
import debounce from "lodash.debounce";
import {withStyles} from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import VolumeOff from '@material-ui/icons/VolumeOff';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/lab/Slider';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/jriver/reducer";
import {muteVolume, setVolume, unmuteVolume} from "../../store/jriver/actions";
import {getConfig} from "../../store/config/reducer";

const styles = theme => ({
    smallButton: {
        height: theme.spacing(3)
    },
    volumeSlider: {
        paddingTop: theme.spacing(5),
        paddingBottom: theme.spacing(1)
    },
    volumeContainer: {
        paddingBottom: theme.spacing(1)
    }
});

class Volume extends Component {

    tweakVolume = (zoneId, newVolume) => {
        this.props.setVolume(zoneId, newVolume);
    };

    setVolume = zoneId => (event, value) => {
        this.props.setVolume(zoneId, value / 100);
    };

    slowSetVolume = zoneId => debounce(this.setVolume(zoneId), 50);

    muteVolume = zoneId => () => {
        this.props.muteVolume(zoneId);
    };

    unmuteVolume = zoneId => () => {
        this.props.unmuteVolume(zoneId);
    };

    makeMuteButton = (zoneId) => {
        const {zone, classes} = this.props;
        if (zone.muted) {
            return <IconButton className={classes.smallButton}
                               onClick={this.unmuteVolume(zoneId)}><VolumeUp/></IconButton>;
        } else {
            return <IconButton className={classes.smallButton}
                               onClick={this.muteVolume(zoneId)}><VolumeOff/></IconButton>;
        }
    };

    render() {
        const {zone, classes} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio ? Math.round(zone.volumeRatio * 100) : 0;
            return (
                <Grid container justify={'space-around'} alignItems={'center'} spacing={1} className={classes.volumeContainer}>
                    <Grid item xs={2}>
                        {this.makeMuteButton(zone.id)}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton className={classes.smallButton}
                                    disabled={zone.volumeRatio === 0}
                                    onClick={() => this.tweakVolume(zone.id, zone.volumeRatio - 0.01)}>
                            <ChevronLeft/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <Slider id="volume-slider"
                                min={0}
                                max={100}
                                step={1}
                                valueLabelDisplay={'auto'}
                                onChange={this.slowSetVolume(zone.id)}
                                value={currentVolume}
                                className={classes.volumeSlider}/>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton className={classes.smallButton}
                                    disabled={zone.volumeRatio === 1}
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
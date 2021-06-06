import React, {Component} from 'react';
import debounce from "lodash.debounce";
import {withStyles} from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import VolumeMute from '@material-ui/icons/VolumeMute';
import VolumeUp from '@material-ui/icons/VolumeUp';
import Slider from '@material-ui/core/Slider';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/jriver/reducer";
import {muteVolume, setVolume, unmuteVolume} from "../../store/jriver/actions";
import {Input} from "@material-ui/core";

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
                               onClick={this.unmuteVolume(zoneId)}><VolumeMute/></IconButton>;
        } else {
            return <IconButton className={classes.smallButton}
                               onClick={this.muteVolume(zoneId)}><VolumeUp/></IconButton>;
        }
    };

    setVolumeDirectly = zoneId => event => {
        const vol = Number(event.target.value);
        if (!isNaN(vol) && vol >= 0 && vol <= 100) {
            this.props.setVolume(zoneId, vol / 100);
        }
    };

    render() {
        const {zone, classes} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio ? Math.round(zone.volumeRatio * 100) : 0;
            return (
                <Grid container justify={'center'} alignItems={'center'} spacing={1}
                      className={classes.volumeContainer}>
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
                    <Grid item xs={5}>
                        <Slider id="volume-slider"
                                min={0}
                                max={100}
                                step={1}
                                valueLabelDisplay={'off'}
                                onChange={this.slowSetVolume(zone.id)}
                                value={currentVolume}
                                className={classes.volumeSlider}/>
                    </Grid>
                    <Grid item xs={1}>
                        <Input value={currentVolume}
                               margin="dense"
                               onChange={this.setVolumeDirectly(zone.id)}
                               inputProps={{
                                   step: 1,
                                   min: 0,
                                   max: 100,
                                   type: 'number',
                                   'aria-labelledby': 'volume-slider',
                               }}
                        />
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
        zone: getActiveZone(state)
    };
};
export default connect(mapStateToProps, {
    setVolume,
    muteVolume,
    unmuteVolume
})(withStyles(styles, {withTheme: true})(Volume));
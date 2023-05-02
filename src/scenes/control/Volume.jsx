import React, {Component} from 'react';
import withStyles from '@mui/styles/withStyles';
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import VolumeMute from '@mui/icons-material/VolumeMute';
import VolumeUp from '@mui/icons-material/VolumeUp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/jriver/reducer";
import {muteVolume, setVolume, unmuteVolume} from "../../store/jriver/actions";
import {Input} from "@mui/material";

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

    muteVolume = zoneId => () => {
        this.props.muteVolume(zoneId);
    };

    unmuteVolume = zoneId => () => {
        this.props.unmuteVolume(zoneId);
    };

    makeMuteButton = (zoneId) => {
        const {zone, classes} = this.props;
        if (zone.muted) {
            return (
                <IconButton
                    className={classes.smallButton}
                    onClick={this.unmuteVolume(zoneId)}
                    size="large"><VolumeMute/></IconButton>
            );
        } else {
            return (
                <IconButton
                    className={classes.smallButton}
                    onClick={this.muteVolume(zoneId)}
                    size="large"><VolumeUp/></IconButton>
            );
        }
    };

    render() {
        const {zone, classes} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio ? Math.round(zone.volumeRatio * 100) : 0;
            return (
                <Grid container justifyContent={'center'} alignItems={'center'} spacing={1}
                      className={classes.volumeContainer}>
                    <Grid item xs={2}>
                        {this.makeMuteButton(zone.id)}
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            className={classes.smallButton}
                            disabled={zone.volumeRatio === 0}
                            onClick={() => this.tweakVolume(zone.id, zone.volumeRatio - 0.05)}
                            size="large">
                            <ArrowBackIosIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            className={classes.smallButton}
                            disabled={zone.volumeRatio === 0}
                            onClick={() => this.tweakVolume(zone.id, zone.volumeRatio - 0.01)}
                            size="large">
                            <ChevronLeft/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={1}>
                        <Input value={currentVolume} margin="dense" disabled/>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            className={classes.smallButton}
                            disabled={zone.volumeRatio === 1}
                            onClick={() => this.tweakVolume(zone.id, zone.volumeRatio + 0.01)}
                            size="large">
                            <ChevronRight/>
                        </IconButton>
                    </Grid>
                    <Grid item xs={2}>
                        <IconButton
                            className={classes.smallButton}
                            disabled={zone.volumeRatio === 1}
                            onClick={() => this.tweakVolume(zone.id, zone.volumeRatio + 0.05)}
                            size="large">
                            <ArrowForwardIosIcon/>
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
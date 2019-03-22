import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import Slider from '@material-ui/lab/Slider';

const MEDIA_Y = 280;
const MEDIA_X = 300;

const styles = theme => ({
    card: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: theme.palette.background.default
    },
    content: {
        flex: '1 100%',
        padding: theme.spacing.unit
    },
    cover: {
        height: MEDIA_Y,
        width: MEDIA_X
    },
    controls: {
        flex: 'auto'
    },
    icon: {
        height: 38,
        width: 38,
    },
    tabAware: {
        marginTop: '0.25em'
    },
    paddedContainer: {
        marginTop: '0em',
        marginBottom: '0em'
    }
});

const padZero = (val) => val < 10 ? `0${val}` : val;

const hhmmss = (millis) => {
    const totalSeconds = Math.round(millis / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);
    return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

const AlbumArtist = ({playingNow}) => {
    const text = `${playingNow.artist} / ${playingNow.album}`;
    const format = text.length > 48 ? 'body2' : 'subheading';
    return (
        <Typography type={format} color="textSecondary">
            {text}
        </Typography>
    );
};

const PlayingNow = ({classes, authToken, playingNow, controls, zoneId}) => {
    const {playPause, stopPlaying, playNext, playPrevious, setPosition} = controls;
    return (
        <Card className={classes.card} elevation={0}>
            <Grid container className={classes.tabAware}>
                <Grid container justify={'space-around'} alignItems={'center'} spacing={0}>
                    <Grid item>
                        <Chip label={hhmmss(playingNow.positionMillis)}/>
                    </Grid>
                    <Grid item>
                        <Chip label={playingNow.positionDisplay}/>
                    </Grid>
                    <Grid item>
                        <Chip label={hhmmss(playingNow.durationMillis - playingNow.positionMillis)}/>
                    </Grid>
                </Grid>
                <Grid container justify={'center'} className={classes.paddedContainer}>
                    <Grid item xs={10}>
                        <Slider id="position-slider"
                                discrete
                                min={0}
                                max={Math.round(playingNow.durationMillis / 1000)}
                                value={Math.round(playingNow.positionMillis / 1000)}
                                onChange={(value, event) => playingNow.status !== 'Stopped' && setPosition(zoneId, value * 1000)}/>
                    </Grid>
                </Grid>
            </Grid>
            {
                authToken
                    ?
                    <CardMedia className={classes.cover}
                               component={'img'}
                               src={`${playingNow.imageURL}&Token=${authToken}&Format=png&Width=${MEDIA_X}&Height=${MEDIA_Y}&Pad=1`}
                               title={playingNow.artist ? `${playingNow.artist}/${playingNow.album}` : playingNow.name}/>
                    : null
            }
            <CardContent className={classes.content}>
                <Typography type="headline">{playingNow.name}</Typography>
                {
                    playingNow.artist
                        ?
                        <AlbumArtist playingNow={playingNow}/>
                        : null
                }
            </CardContent>
            <div className={classes.controls}>
                <IconButton aria-label="Previous">
                    <SkipPreviousIcon onClick={() => playPrevious(zoneId)} className={classes.icon}/>
                </IconButton>
                <IconButton aria-label="Play/pause">
                    {
                        (playingNow.status === 'Stopped' || playingNow.status === 'Paused')
                            ? <PlayArrowIcon onClick={() => playPause(zoneId)} className={classes.icon}/>
                            : <PauseIcon onClick={() => playPause(zoneId)} className={classes.icon}/>
                    }
                </IconButton>
                <IconButton aria-label="Stop">
                    <StopIcon onClick={() => stopPlaying(zoneId)} className={classes.icon}/>
                </IconButton>
                <IconButton aria-label="Next">
                    <SkipNextIcon onClick={() => playNext(zoneId)} className={classes.icon}/>
                </IconButton>
            </div>
        </Card>
    );
};

PlayingNow.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    controls: PropTypes.object.isRequired,
    playingNow: PropTypes.object.isRequired,
    zoneId: PropTypes.string.isRequired,
};

export default withStyles(styles, {withTheme: true})(PlayingNow);
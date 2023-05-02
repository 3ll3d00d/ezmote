import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from "@mui/material/Grid";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Slider from '@mui/material/Slider';

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
        padding: theme.spacing(1)
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
        marginTop: '1em'
    },
    paddedContainer: {
        marginTop: '0em',
        marginBottom: '0em'
    },
    volumeSlider: {
        paddingTop: theme.spacing(3)
    },
    volumeContainer: {
        paddingBottom: theme.spacing(3)
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
    const format = text.length > 48 ? 'body2' : 'h6';
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
            <Grid container className={classes.tabAware} spacing={1}>
                <Grid container justifyContent={'space-around'} alignItems={'center'} spacing={1}>
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
                <Grid container justifyContent={'center'} className={classes.volumeContainer}>
                    <Grid item xs={10}>
                        <Slider id="position-slider"
                                min={0}
                                max={Math.round(playingNow.durationMillis / 1000)}
                                value={Math.round(playingNow.positionMillis / 1000)}
                                onChange={(value, event) => playingNow.status !== 'Stopped' && setPosition(zoneId, value * 1000)}
                                className={classes.volumeSlider}/>
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
                <Typography type="h5">{playingNow.name}</Typography>
                {
                    playingNow.artist
                        ?
                        <AlbumArtist playingNow={playingNow}/>
                        : null
                }
            </CardContent>
            <div className={classes.controls}>
                <IconButton aria-label="Previous" onClick={() => playPrevious(zoneId)} size="large">
                    <SkipPreviousIcon className={classes.icon}/>
                </IconButton>
                <IconButton aria-label="Play/pause" onClick={() => playPause(zoneId)} size="large">
                    {
                        (playingNow.status === 'Stopped' || playingNow.status === 'Paused')
                            ? <PlayArrowIcon className={classes.icon}/>
                            : <PauseIcon className={classes.icon}/>
                    }
                </IconButton>
                <IconButton aria-label="Stop" onClick={() => stopPlaying(zoneId)} size="large">
                    <StopIcon className={classes.icon}/>
                </IconButton>
                <IconButton aria-label="Next" onClick={() => playNext(zoneId)} size="large">
                    <SkipNextIcon className={classes.icon}/>
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
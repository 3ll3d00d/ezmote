import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import Box from "@mui/material/Box";

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
        marginTop: '1em',
        marginBottom: '0.75em'
    },
    paddedContainer: {
        marginTop: '1em',
        marginBottom: '1em'
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

const LowerCaseButton = styled(Button)({
    textTransform: 'lowercase'
});

const getActiveHdrProfile = hdr => {
    return hdr ? Number.parseInt(hdr) : 0;
}

const PlayingNow = ({classes, authToken, playingNow, controls, zoneId}) => {
    const {playPause, stopPlaying, playNext, playPrevious, shiftPosition, setHdrPreset} = controls;
    const activeHdrProfile = getActiveHdrProfile(playingNow.hdr_override);
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
                <Grid container justifyContent={'center'} className={classes.paddedContainer}>
                    <Grid item>
                        <ButtonGroup variant={'outlined'} >
                            <LowerCaseButton aria-label="Minus5"
                                    onClick={() => shiftPosition(zoneId, -300000)}
                                    variant={'outlined'}
                                    sx={ { borderRadius: 28 } }>
                                -5m
                            </LowerCaseButton>
                            <LowerCaseButton aria-label="Minus30"
                                    onClick={() => shiftPosition(zoneId, -30000)}
                                    variant={'outlined'}>
                                -30s
                            </LowerCaseButton>
                            <LowerCaseButton aria-label="Minus1"
                                    onClick={() => shiftPosition(zoneId, -1000)}
                                    variant={'outlined'}>
                                -1s
                            </LowerCaseButton>
                            <LowerCaseButton aria-label="Plus1"
                                    onClick={() => shiftPosition(zoneId, 1000)}
                                    variant={'outlined'}>
                                +1s
                            </LowerCaseButton>
                            <LowerCaseButton aria-label="Plus30"
                                    onClick={() => shiftPosition(zoneId, 30000)}
                                    variant={'outlined'}>
                                +30s
                            </LowerCaseButton>
                            <LowerCaseButton aria-label="Plus5"
                                    onClick={() => shiftPosition(zoneId, 300000)}
                                    variant={'outlined'}
                                    sx={ { borderRadius: 28 } }>
                                +5m
                            </LowerCaseButton>
                        </ButtonGroup>
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
            <Box className={classes.controls}>
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
            </Box>
            {
                playingNow.hdr
                ?
                    <Box className={classes.controls}>
                        <ButtonGroup variant={'outlined'} >
                            <Button aria-label="clear"
                                    onClick={() => setHdrPreset(zoneId, null)}
                                    variant={activeHdrProfile === 0 ? 'contained' : 'outlined'}
                                    sx={ { borderRadius: 28 } }>
                                Auto
                            </Button>
                            <Button aria-label="178"
                                    onClick={() => setHdrPreset(zoneId, '1')}
                                    variant={activeHdrProfile === 1 ? 'contained' : 'outlined'}
                                    sx={ { borderRadius: 28 } }>
                                1
                            </Button>
                            <Button aria-label="235"
                                    onClick={() => setHdrPreset(zoneId, '2')}
                                    variant={activeHdrProfile === 2 ? 'contained' : 'outlined'}>
                                2
                            </Button>
                            <Button aria-label="Minus1"
                                    onClick={() => setHdrPreset(zoneId, '3')}
                                    variant={activeHdrProfile === 3 ? 'contained' : 'outlined'}
                                    sx={ { borderRadius: 28 } }>
                                3
                            </Button>
                        </ButtonGroup>
                    </Box>
                    : null
            }
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
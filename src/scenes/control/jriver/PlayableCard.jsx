import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EnterIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import BeenhereIcon from '@mui/icons-material/Beenhere';
import {PLAY_TYPE_BROWSE} from "../../../services/jriver/mcws/browseChildren";
import CardMedia from "@mui/material/CardMedia";
import React from "react";
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles(theme => ({
    row: {
        display: 'flex',
        paddingTop: 4,
        paddingBottom: 4,
        backgroundColor: theme.palette.background.default,
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        flexGrow: 1
    },
    content: {
        flex: '1 0 auto',
        padding: 0
    },
    cardIcon: {
        height: 24,
        width: 24,
        padding: 0
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(0.5),
    },
    cover: {
        height: 96,
        width: 96,
    },
    unpadded: {
        paddingLeft: theme.spacing(1),
        paddingTop: theme.spacing(1)
    }
}));

const getImgUrl = (mcwsURL, type, id, width, height, fallbackColour, authToken) => {
    const path = type === PLAY_TYPE_BROWSE ? 'Browse/Image' : 'File/GetImage';
    const fileParam = type === PLAY_TYPE_BROWSE ? 'ID' : 'File';
    const params = `Token=${authToken}&${fileParam}=${id}&Format=png&Width=${width}&Height=${height}&Pad=1&FallbackColor=${fallbackColour}`;
    return `${mcwsURL}/${path}?${params}`;
};

const formatDuration = content => {
    try {
        const dateStr = new Date(content.duration * 1000).toISOString().substr(11, 8);
        return ` \u2022 ${dateStr}`;
    } catch (e) {
        return '';
    }
}

const wasRecentlyPlayed = content => {
    if (content.lastPlayed) {
        if (!isNaN(content.lastPlayed)) {
            const now = Math.floor(new Date().getTime() / 1000);
            // played in last 2 months
            if (content.lastPlayed > (now - (60 * 60 * 24 * 60))) {
                return true;
            }
        }
    }
    return false;
}

const Description = ({content}) => {
    if (content.mediaType === 'Audio') {
        return (
            <>
                <Typography variant="body1" color="textSecondary">
                    {content.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {content.artist}
                    {formatDuration(content)}
                </Typography>
            </>
        )
    } else if (content.mediaType === 'Video') {
        if (content.mediaSubType === 'Movie') {
            const year = content.year ? ` \u2022 ${content.year}` : '';
            const ar = content.cropAR ? ` \u2022 ${content.cropAR}` : '';
            return (
                <>
                    <Typography variant="body1" color="textSecondary">
                        {content.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {content.rez}
                        {year}
                        {formatDuration(content)}
                        {ar}
                    </Typography>
                </>
            )
        } else if (content.mediaSubType === 'TV Show') {
            let sub = null;
            if (content.season) {
                sub = `S${content.season}`;
            }
            if (content.episode) {
                sub = `${sub}E${content.episode}`;
            }
            if (sub) {
                sub = `${sub} \u2022 `;
            }
            const rez = content.rez ? `${content.rez}` : '';
            return (
                <>
                    <Typography variant="body1" color="textSecondary">
                        {content.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        {sub}
                        {rez}
                        {formatDuration(content)}
                    </Typography>
                </>
            )
        }
    }
    return <Typography variant="body2" color="textSecondary">
        {content.name}
    </Typography>;
};

const PlayableCard = ({mcwsUrl, content, width, height, onSelect, fallbackColour, onPlay, authToken}) => {
    const classes = useStyles();
    const {type, name, id} = content;
    return (
        <Card key={id} className={classes.row} elevation={0}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Description content={content}/>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton
                        aria-label="Play"
                        className={classes.unpadded}
                        onClick={() => onPlay(type, id)}
                        size="large">
                        <PlayArrowIcon className={classes.cardIcon}/>
                    </IconButton>
                    {
                        type === PLAY_TYPE_BROWSE
                            ?
                            <IconButton
                                aria-label="Enter"
                                className={classes.unpadded}
                                onClick={() => onSelect(id)}
                                size="large">
                                <EnterIcon className={classes.cardIcon}/>
                            </IconButton>
                            : null
                    }
                    {
                        wasRecentlyPlayed(content)
                        ?
                            <BeenhereIcon fontSize={'small'}/>
                            : null
                    }
                </div>
            </div>
            <CardMedia className={classes.cover}
                       image={getImgUrl(mcwsUrl, type, id, width, height, fallbackColour, authToken)}
                       component='img'
                       title={name}/>
        </Card>
    );
};

export default PlayableCard;
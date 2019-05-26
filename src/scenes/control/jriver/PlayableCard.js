import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import EnterIcon from '@material-ui/icons/SubdirectoryArrowLeft';
import {PLAY_TYPE_BROWSE} from "../../../services/jriver/mcws/browseChildren";
import CardMedia from "@material-ui/core/CardMedia";
import React from "react";
import { makeStyles } from '@material-ui/core/styles';

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
        paddingBottom: theme.spacing(1),
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

const PlayableCard = ({mcwsUrl, type, name, id, width, height, onSelect, fallbackColour, authToken, onPlay}) => {
    const classes = useStyles();
    return (
        <Card key={id} className={classes.row} elevation={3}>
            <div className={classes.details}>
                <CardContent className={classes.content}>
                    <Typography variant="body2" color="textSecondary">
                        {name}
                    </Typography>
                </CardContent>
                <div className={classes.controls}>
                    <IconButton aria-label="Play"
                                className={classes.unpadded}
                                onClick={() => onPlay(type, id)}>
                        <PlayArrowIcon className={classes.cardIcon}/>
                    </IconButton>
                    {
                        type === PLAY_TYPE_BROWSE
                            ?
                            <IconButton aria-label="Enter"
                                        className={classes.unpadded}
                                        onClick={() => onSelect(id)}>
                                <EnterIcon className={classes.cardIcon}/>
                            </IconButton>
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
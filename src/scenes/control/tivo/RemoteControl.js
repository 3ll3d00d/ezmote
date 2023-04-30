import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import UpArrow from '@mui/icons-material/ArrowUpward';
import DownArrow from '@mui/icons-material/ArrowDownward';
import LeftArrow from '@mui/icons-material/ArrowBack';
import RightArrow from '@mui/icons-material/ArrowForward';
import Check from '@mui/icons-material/Check';
import Send from '@mui/icons-material/Send';
import Record from '@mui/icons-material/FiberSmartRecord'
import Delete from '@mui/icons-material/Delete';
import ThumbUp from '@mui/icons-material/ThumbUp';
import ThumbDown from '@mui/icons-material/ThumbDown';
import LiveTV from '@mui/icons-material/LiveTv';
import Home from '@mui/icons-material/Home';
import ExitToApp from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import SkipPrevious from '@mui/icons-material/SkipPrevious';
import PlayArrow from '@mui/icons-material/PlayArrow';
import Pause from '@mui/icons-material/Pause';
import Stop from '@mui/icons-material/Stop';
import SkipNext from '@mui/icons-material/SkipNext';
import FastForward from '@mui/icons-material/FastForward';
import FastRewind from '@mui/icons-material/FastRewind';
import SlowMotionVideo from '@mui/icons-material/SlowMotionVideo';
import VideoLibrary from '@mui/icons-material/VideoLibrary';
import FeaturedPlaylist from '@mui/icons-material/FeaturedPlayList';
import FormControl from "@mui/material/FormControl";
import Tooltip from "@mui/material/Tooltip/Tooltip";
import Input from '@mui/material/Input';
import {connect} from "react-redux";
import withStyles from '@mui/styles/withStyles';
import {sendIRToTivo, sendTextToTivo} from '../../../store/tivos/actions';
import * as codes from './CommandCodes';
import classNames from 'classnames';
import {getCurrentChannel} from "../../../store/tivos/reducer";
import TivoChannelSelector from "./TivoChannelSelector";

const styles = (theme) => ({
    input: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: '0px'
    },
    smallPadded: {
        marginTop: '0.25em',
        marginBottom: '0.25em'
    },
    rcButton: {
        minWidth: '32px',
    },
    roundButton: {
        borderRadius: '45%'
    },
    playButton: {
        minWidth: '24px',
        width: '24px',
        height: theme.spacing(4)
    },
    blue: {
        color: 'blue',
    },
    blueBackground: {
        backgroundColor: 'blue'
    },
    red: {
        color: 'red',
    },
    redBackground: {
        backgroundColor: 'red'
    },
    green: {
        color: 'green',
    },
    greenBackground: {
        backgroundColor: 'green',
    },
    yellow: {
        color: 'yellow',
    },
    yellowBackground: {
        backgroundColor: 'yellow',
    },
    icon: {
        height: '1.25em',
        width: '1.25em',
    },
});

class RemoteControl extends Component {
    state = {
        text: ''
    };

    handleInput = (event) => {
        this.setState({text: event.target.value});
    };

    sendText = () => {
        this.props.sendTextToTivo(this.state.text);
        this.setState({text: ''});
    };

    makeRCButton = ({key, text = null, CI = null, classes = this.props.classes.rcButton}) => {
        return (
            <Tooltip id={key} title={key}>
                <Button key={key}
                        variant={'contained'}
                        onClick={() => this.props.sendIRToTivo(key)}
                        className={classes}>
                    {text}
                    {CI ? <CI/> : null}
                </Button>
            </Tooltip>
        );
    };

    makePlayButton = ({key, text = null, CI = null, classes = this.props.classes.rcButton}) => {
        return (
            <Tooltip id={key} title={key}>
                <IconButton
                    key={key}
                    onClick={() => this.props.sendIRToTivo(key)}
                    className={classes}
                    size="large">
                    {text}
                    {CI ? <CI className={this.props.classes.icon}/> : null}
                </IconButton>
            </Tooltip>
        );
    };

    getRoundButtonClasses = () => classNames(this.props.classes.rcButton, this.props.classes.roundButton);

    getActionButtonClasses = colour => {
        return classNames(this.props.classes.rcButton,
            this.props.classes.roundButton,
            this.props.classes[colour],
            this.props.classes[`${colour}Background`]);
    };

    getThumbsClasses = colour => {
        return classNames(this.props.classes.rcButton,
            this.props.classes.roundButton,
            this.props.classes[`${colour}Background`]);
    };

    getPlayButtonClasses = () => {
        return classNames(this.props.classes.roundButton, this.props.classes.playButton);
    };

    render() {
        const {classes, currentChannel} = this.props;
        return (
            <Grid spacing={1} container>
                <Grid container spacing={1} justifyContent={'center'} align-items={'center'} className={classes.smallPadded}>
                    <Grid item>
                        <TivoChannelSelector currentChannel={currentChannel}/>
                    </Grid>
                </Grid>
                <Grid container spacing={1} justifyContent={'center'} align-items={'center'} className={classes.smallPadded}>
                    <Grid item sm={5} md={4}>
                        <Grid container spacing={1} justifyContent={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({key: codes.LIVE_TV, CI: LiveTV})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: codes.GUIDE, CI: FeaturedPlaylist})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: codes.MY_SHOWS, CI: VideoLibrary})}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} justifyContent={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.INFO,
                                    CI: InfoOutlined,
                                    classes: this.getRoundButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: codes.HOME, CI: Home})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: codes.BACK, CI: ExitToApp})}
                            </Grid>
                        </Grid>
                        <Grid container spacing={1} justifyContent={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.REWIND,
                                    CI: FastRewind,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.PAUSE,
                                    CI: Pause,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.PLAY,
                                    CI: PlayArrow,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.STOP,
                                    CI: Stop,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.FF,
                                    CI: FastForward,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                        </Grid>
                        <Grid container
                              justifyContent={'center'}
                              align-items={'center'}
                              className={classes.smallPadded}
                              spacing={2}>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.REPLAY,
                                    CI: SkipPrevious,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.SLOW,
                                    CI: SlowMotionVideo,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: codes.ADVANCE,
                                    CI: SkipNext,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                        </Grid>
                        <Grid container spacing={3} justifyContent={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.THUMBS_DOWN,
                                    CI: ThumbDown,
                                    classes: this.getThumbsClasses('red')
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.RECORD,
                                    CI: Record,
                                    classes: this.getThumbsClasses('red')
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.THUMBS_UP,
                                    CI: ThumbUp,
                                    classes: this.getThumbsClasses('green')
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm={5} md={4}>
                        <Grid container justifyContent={'center'} alignItems={'center'} spacing={1}>
                            <Grid item xs={1}/>
                            <Grid item xs={7}>
                                <FormControl variant="standard" className={classes.formControl}>
                                    <Input value={this.state.text}
                                           id="textinput"
                                           label="Text Input"
                                           className={classes.input}
                                           inputProps={{
                                               'aria-label': 'Text',
                                           }}
                                           onChange={this.handleInput}/>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Tooltip id={codes.CLEAR} title={codes.CLEAR}>
                                    <Button size={'small'}
                                            className={classes.rcButton}>
                                        <Delete onClick={() => this.props.sendIRToTivo(codes.CLEAR)}/>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Button disabled={this.state.text.length === 0}
                                        size={'small'}
                                        className={classes.rcButton}>
                                    <Send onClick={this.sendText}/>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={'center'} alignItems={'center'} spacing={1}>
                            <Grid item className={classes.smallPadded}>
                                <Grid container justifyContent={'space-around'} alignItems={'center'}
                                      className={classes.smallPadded}
                                      spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.UP, CI: UpArrow})}
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent={'space-around'} alignItems={'center'} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.LEFT, CI: LeftArrow})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.RETURN, CI: Check})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.RIGHT, CI: RightArrow})}
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent={'space-around'} alignItems={'center'}
                                      className={classes.smallPadded}
                                      spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.DOWN, CI: DownArrow})}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container
                                      direction={'column'}
                                      justifyContent={'center'}
                                      align-items={'center'}
                                      className={classes.smallPadded}
                                      spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.CHANNEL_UP, CI: ExpandLess})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.CHANNEL_DOWN, CI: ExpandMore})}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={'center'} align-items={'center'} className={classes.smallPadded}
                              spacing={1}>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.RED,
                                    text: 'R',
                                    classes: this.getActionButtonClasses('red')
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.GREEN,
                                    text: 'G',
                                    classes: this.getActionButtonClasses('green')
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.YELLOW,
                                    text: 'Y',
                                    classes: this.getActionButtonClasses('yellow')
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.BLUE,
                                    text: 'B',
                                    classes: this.getActionButtonClasses('blue')
                                })}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        currentChannel: getCurrentChannel(state)
    };
};
export default connect(mapStateToProps, {
    sendIRToTivo,
    sendTextToTivo
})(withStyles(styles, {withTheme: true})(RemoteControl));
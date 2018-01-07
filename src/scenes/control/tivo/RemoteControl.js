import React, {Component} from 'react';
import Grid from "material-ui/Grid";
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import UpArrow from 'material-ui-icons/ArrowUpward';
import DownArrow from 'material-ui-icons/ArrowDownward';
import LeftArrow from 'material-ui-icons/ArrowBack';
import RightArrow from 'material-ui-icons/ArrowForward';
import Check from 'material-ui-icons/Check';
import Send from 'material-ui-icons/Send';
import Clear from 'material-ui-icons/Clear';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import LiveTV from 'material-ui-icons/LiveTv';
import Home from 'material-ui-icons/Home';
import ExitToApp from 'material-ui-icons/ExitToApp';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import InfoOutline from 'material-ui-icons/InfoOutline';
import SkipPrevious from 'material-ui-icons/SkipPrevious';
import PlayArrow from 'material-ui-icons/PlayArrow';
import Pause from 'material-ui-icons/Pause';
import Stop from 'material-ui-icons/Stop';
import SkipNext from 'material-ui-icons/SkipNext';
import FastForward from 'material-ui-icons/FastForward';
import FastRewind from 'material-ui-icons/FastRewind';
import SlowMotionVideo from 'material-ui-icons/SlowMotionVideo';
import VideoLibrary from 'material-ui-icons/VideoLibrary';
import FeaturedPlaylist from 'material-ui-icons/FeaturedPlayList';
import FormControl from "material-ui/Form/FormControl";
import Tooltip from "material-ui/Tooltip/Tooltip";
import Input from 'material-ui/Input';
import {connect} from "react-redux";
import {getConfig} from "../../../store/config/reducer";
import {withStyles} from "material-ui/styles/index";
import {sendIRToTivo, sendTextToTivo} from '../../../store/commands/actions';
import * as codes from './CommandCodes';
import classNames from 'classnames';

const styles = (theme) => ({
    input: {
        margin: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    padded: {
        marginTop: '1em'
    },
    smallPadded: {
        marginTop: '0.25em',
        marginBottom: '0.25em'
    },
    bordered: {
        border: '2px solid black'
    },
    rcButton: {
        minWidth: '32px'
    },
    roundButton: {
        borderRadius: '100%'
    },
    playButton: {
        minWidth: '16px',
        width: '16px',
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
                <Button key={key} raised dense
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
                <IconButton key={key}
                            onClick={() => this.props.sendIRToTivo(key)}
                            className={classes}>
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
        const {classes} = this.props;
        return (
            <Grid container className={classNames(classes.padded, classes.bordered)}>
                <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                    <Grid item sm={5} md={3}>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
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
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({
                                    key: codes.INFO,
                                    CI: InfoOutline,
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
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
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
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
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
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
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
                                    text: 'R',
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
                    <Grid item sm={5} md={3}>
                        <Grid container justify={'center'} alignItems={'center'}>
                            <Grid item xs={6}>
                                <FormControl className={classes.formControl}>
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
                                    <Button dense className={classes.rcButton}>
                                        <Clear onClick={() => this.props.sendIRToTivo(codes.CLEAR)}/>
                                    </Button>
                                </Tooltip>
                            </Grid>
                            <Grid item>
                                <Button disabled={this.state.text.length === 0} dense className={classes.rcButton}>
                                    <Send onClick={this.sendText}/>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} alignItems={'center'}>
                            <Grid item className={classes.smallPadded}>
                                <Grid container justify={'space-around'} alignItems={'center'}
                                      className={classes.smallPadded}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.UP, CI: UpArrow})}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'}>
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
                                <Grid container justify={'space-around'} alignItems={'center'}
                                      className={classes.smallPadded}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.DOWN, CI: DownArrow})}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction={'column'} justify={'center'} align-items={'center'}
                                      className={classes.smallPadded}>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.CHANNEL_UP, CI: ExpandLess})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: codes.CHANNEL_DOWN, CI: ExpandMore})}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
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
        config: getConfig(state)
    };
};
export default connect(mapStateToProps, {
    sendIRToTivo,
    sendTextToTivo
})(withStyles(styles, {withTheme: true})(RemoteControl));
import React, {Component} from 'react';
import Grid from "material-ui/Grid";
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import UpArrow from 'material-ui-icons/ArrowUpward';
import KeyboardLeftArrow from 'material-ui-icons/KeyboardArrowLeft';
import KeyboardRightArrow from 'material-ui-icons/KeyboardArrowRight';
import FirstPage from 'material-ui-icons/FirstPage';
import LastPage from 'material-ui-icons/LastPage';
import DownArrow from 'material-ui-icons/ArrowDownward';
import LeftArrow from 'material-ui-icons/ArrowBack';
import RightArrow from 'material-ui-icons/ArrowForward';
import Check from 'material-ui-icons/Check';
import Send from 'material-ui-icons/Send';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import LiveTV from 'material-ui-icons/LiveTv';
import Home from 'material-ui-icons/Home';
import ExitToApp from 'material-ui-icons/ExitToApp';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import InfoOutline from 'material-ui-icons/InfoOutline';
import SkipPreviousIcon from 'material-ui-icons/SkipPrevious';
import PlayArrowIcon from 'material-ui-icons/PlayArrow';
import PauseIcon from 'material-ui-icons/Pause';
import StopIcon from 'material-ui-icons/Stop';
import SkipNextIcon from 'material-ui-icons/SkipNext';
import FastForward from 'material-ui-icons/FastForward';
import FastRewind from 'material-ui-icons/FastRewind';
import SlowMotionVideo from 'material-ui-icons/SlowMotionVideo';
import VideoLibrary from 'material-ui-icons/VideoLibrary';
import FeaturedPlaylist from 'material-ui-icons/FeaturedPlayList';
import FormControl from "material-ui/Form/FormControl";
import InputLabel from "material-ui/Input/InputLabel";
import Input from 'material-ui/Input';
import {connect} from "react-redux";
import {getConfig} from "../../../store/config/reducer";
import {withStyles} from "material-ui/styles/index";
import {sendKeyPresses} from '../../../store/jriver/actions';
import classNames from 'classnames';

const styles = (theme) => ({
    input: {
        margin: theme.spacing.unit
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
        this.props.sendKeyPresses(this.state.text.split(''));
        this.setState({text: ''});
    };

    makeRCButton = ({key, text = null, CI = null, classes = this.props.classes.rcButton}) => {
        return (
            <Button key={key} raised dense
                    onClick={() => this.props.sendKeyPresses(key)}
                    className={classes}>
                {text}
                {CI ? <CI/> : null}
            </Button>
        );
    };

    makePlayButton = ({key, text = null, CI = null, classes = this.props.classes.rcButton}) => {
        return (
            <IconButton key={key}
                        onClick={() => this.props.sendKeyPresses(key)}
                        className={classes}>
                {text}
                {CI ? <CI className={this.props.classes.icon}/> : null}
            </IconButton>
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
                    <Grid item sm={6}>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({key: 'TV', CI: LiveTV})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Guide', CI: FeaturedPlaylist})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'My Shows', CI: VideoLibrary})}
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({key: 'Info', CI: InfoOutline, classes: this.getRoundButtonClasses()})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Home', CI: Home})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Exit', CI: ExitToApp})}
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Rewind',
                                    CI: FastRewind,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Pause',
                                    CI: PauseIcon,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Play',
                                    CI: PlayArrowIcon,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Stop',
                                    CI: StopIcon,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'FF',
                                    CI: FastForward,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Replay',
                                    CI: SkipPreviousIcon,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Slow',
                                    CI: SlowMotionVideo,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                            <Grid item>
                                {this.makePlayButton({
                                    key: 'Advance',
                                    CI: SkipNextIcon,
                                    classes: this.getPlayButtonClasses()
                                })}
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({key: 'Thumbs Down', CI: ThumbDown, classes: this.getThumbsClasses('red')})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Record', text: 'R', classes: this.getThumbsClasses('red')})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Thumbs Up', CI: ThumbUp, classes: this.getThumbsClasses('green')})}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item sm>
                        <Grid container justify={'flex-start'} alignItems={'center'}>
                            <Grid item sm>
                                <FormControl className={classes.formControl}>
                                    <InputLabel htmlFor="textinput">Text</InputLabel>
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
                            <Grid item sm={6}>
                                <Button disabled={this.state.text.length === 0} dense>
                                    <Send onClick={this.sendText}/>
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justify={'space-around'} alignItems={'center'}>
                            <Grid item>
                                <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded}>
                                    <Grid item>
                                        {this.makeRCButton({key: 'Up', CI: UpArrow})}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'}>
                                    <Grid item>
                                        {this.makeRCButton({key: 'Left', CI: LeftArrow})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: 'Enter', CI: Check})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: 'Right', CI: RightArrow})}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded}>
                                    <Grid item>
                                        {this.makeRCButton({key: 'Down', CI: DownArrow})}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container direction={'column'} justify={'center'} align-items={'center'}
                                      className={classes.smallPadded}>
                                    <Grid item>
                                        {this.makeRCButton({key: 'CH+', CI: ExpandLess})}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton({key: 'CH-', CI: ExpandMore})}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton({key: 'Red', text: 'R', classes: this.getActionButtonClasses('red')})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Green', text: 'G', classes: this.getActionButtonClasses('green')})}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({
                                    key: 'Yellow',
                                    text: 'Y',
                                    classes: this.getActionButtonClasses('yellow')
                                })}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton({key: 'Blue', text: 'B', classes: this.getActionButtonClasses('blue')})}
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
export default connect(mapStateToProps, {sendKeyPresses})(withStyles(styles, {withTheme: true})(RemoteControl));
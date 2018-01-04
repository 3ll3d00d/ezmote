import React, {Component} from 'react';
import Grid from "material-ui/Grid";
import Button from 'material-ui/Button';
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
    }
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

    makeRCButton = (key, CI) => {
        return (
            <Button key={key} raised dense
                    onClick={() => this.props.sendKeyPresses(key)}
                    className={this.props.classes.rcButton}>
                <CI/>
            </Button>
        );
    };

    render() {
        const {classes} = this.props;
        return (
            <Grid container className={classNames(classes.padded, classes.bordered)}>
                <Grid container justify={'center'} align-items={'center'} className={classes.smallPadded}>
                    <Grid item>
                        {this.makeRCButton('Home', FirstPage)}
                    </Grid>
                    <Grid item>
                        {this.makeRCButton('Page Up', KeyboardLeftArrow)}
                    </Grid>
                    <Grid item>
                        {this.makeRCButton('Page Down', KeyboardRightArrow)}
                    </Grid>
                    <Grid item>
                        {this.makeRCButton('End', LastPage)}
                    </Grid>
                </Grid>
                <Grid container justify={'space-around'} alignItems={'center'}>
                    <Grid item>
                        <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton('Up', UpArrow)}
                            </Grid>
                        </Grid>
                        <Grid container justify={'space-around'} alignItems={'center'}>
                            <Grid item>
                                {this.makeRCButton('Left', LeftArrow)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Enter', Check)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Right', RightArrow)}
                            </Grid>
                        </Grid>
                        <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded}>
                            <Grid item>
                                {this.makeRCButton('Down', DownArrow)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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
import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import UpArrow from '@mui/icons-material/ArrowUpward';
import KeyboardLeftArrow from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardRightArrow from '@mui/icons-material/KeyboardArrowRight';
import FirstPage from '@mui/icons-material/FirstPage';
import LastPage from '@mui/icons-material/LastPage';
import DownArrow from '@mui/icons-material/ArrowDownward';
import LeftArrow from '@mui/icons-material/ArrowBack';
import RightArrow from '@mui/icons-material/ArrowForward';
import Check from '@mui/icons-material/Check';
import Send from '@mui/icons-material/Send';
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from '@mui/material/Input';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const styles = (theme) => ({
    input: {
        margin: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
    },
    padded: {
        marginTop: '1em',
    },
    smallPadded: {
        marginTop: '0.25em',
        marginBottom: '0.25em'
    },
    bordered: {
        borderTop: '2px solid black',
        borderBottom: '2px solid black'
    },
    rcButton: {
        minWidth: '32px'
    }
});

class RemoteControl extends Component {
    static propTypes = {
        controls: PropTypes.object.isRequired
    };

    state = {
        text: ''
    };

    handleInput = (event) => {
        this.setState({text: event.target.value});
    };

    sendText = () => {
        this.props.controls.sendKeyPresses(this.state.text.split(''));
        this.setState({text: ''});
    };

    makeRCButton = (key, CI) => {
        return (
            <Button key={key}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => this.props.controls.sendKeyPresses(key)}
                    className={this.props.classes.rcButton}>
                <CI/>
            </Button>
        );
    };

    render() {
        const {classes} = this.props;

        return (
            <Grid container className={classNames(classes.padded, classes.bordered)} spacing={1}>
                <Grid container justifyContent={'center'} align-items={'center'} className={classes.smallPadded} spacing={1}>
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
                <Grid container justifyContent={'space-around'} alignItems={'center'} spacing={1}>
                    <Grid item>
                        <Grid container justifyContent={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {this.makeRCButton('Up', UpArrow)}
                            </Grid>
                        </Grid>
                        <Grid container justifyContent={'space-around'} alignItems={'center'} spacing={1}>
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
                        <Grid container justifyContent={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {this.makeRCButton('Down', DownArrow)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container justifyContent={'flex-start'} alignItems={'center'} spacing={1}>
                    <Grid item sm>
                        <FormControl variant="standard" className={classes.formControl}>
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
                        <Button disabled={this.state.text.length === 0}
                                size={'small'}>
                            <Send onClick={this.sendText}/>
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

export default withStyles(styles, {withTheme: true})(RemoteControl);
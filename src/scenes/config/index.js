import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Input from 'material-ui/Input';
import {connect} from "react-redux";
import * as configActions from '../../store/config/actions';
import {getConfig} from "../../store/config/reducer";
import * as configFields from "../../store/config/config";
import {FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, Switch} from "material-ui";
import {Visibility, VisibilityOff} from "material-ui-icons";

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        margin: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
    },
    withoutLabel: {
        marginTop: theme.spacing.unit * 3,
    }
});

class Config extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    state = {
        showPassword: false
    };

    handleInput = (field) => (event) => {
        this.props.dispatch(configActions.updateValue(field, event.target.value));
    };

    handleSwitch = (field) => (event, checked) => {
        this.props.dispatch(configActions.updateValue(field, checked));
    };

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        this.setState((prevState, prevProps) => {
            return {showPassword: !prevState.showPassword}
        });
    };

    render() {
        const {classes, config} = this.props;

        return (
            <div className={classes.container}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="mchose">Host</InputLabel>
                    <Input value={config[configFields.MC_HOST]}
                           id="mchost"
                           label="JRMC Host"
                           className={classes.input}
                           inputProps={{
                               'aria-label': 'Description',
                           }}
                           onChange={this.handleInput(configFields.MC_HOST)}/>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="mcport">Port</InputLabel>
                    <Input value={config[configFields.MC_PORT]}
                           id="mcport"
                           label="JRMC Port"
                           type="number"
                           className={classes.input}
                           inputProps={{
                               'aria-label': 'Description',
                           }}
                           onChange={this.handleInput(configFields.MC_PORT)}/>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch checked={config[configFields.MC_USE_SSL]}
                                onChange={this.handleSwitch(configFields.MC_USE_SSL)}/>
                    }
                    label="Use SSL?"/>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="mcuser">Username</InputLabel>
                    <Input value={config[configFields.MC_USERNAME]}
                           id="mcuser"
                           label="JRMC Username"
                           className={classes.input}
                           inputProps={{
                               'aria-label': 'Description',
                           }}
                           onChange={this.handleInput(configFields.MC_USERNAME)}/>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="mcpassword">Password</InputLabel>
                    <Input id="mcpassword"
                           type={this.state.showPassword ? 'text' : 'password'}
                           value={config[configFields.MC_PASSWORD]}
                           onChange={this.handleInput(configFields.MC_PASSWORD)}
                           endAdornment={
                               <InputAdornment position="end">
                                   <IconButton
                                       onClick={this.handleClickShowPassword}
                                       onMouseDown={this.handleMouseDownPassword}>
                                       {this.state.showPassword ? <VisibilityOff/> : <Visibility/>}
                                   </IconButton>
                               </InputAdornment>
                           }/>
                </FormControl>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="cmdport">Port (cmdserver)</InputLabel>
                    <Input value={config[configFields.CMDSERVER_PORT]}
                           id="cmdport"
                           label="CMD Server Port"
                           type="number"
                           className={classes.input}
                           inputProps={{
                               'aria-label': 'Description',
                           }}
                           onChange={this.handleInput(configFields.CMDSERVER_PORT)}/>
                </FormControl>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {config: getConfig(state)};
};

export default connect(mapStateToProps)(withStyles(styles)(Config));

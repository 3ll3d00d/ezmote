import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Input from 'material-ui/Input';
import {connect} from "react-redux";
import * as configActions from '../../store/config/actions';
import {MC_USE_SSL, MC_PASSWORD, MC_USERNAME, MC_HOST, MC_PORT, getConfigValues} from "../../store/config/reducer";
import {FormControlLabel, IconButton, InputAdornment, Switch} from "material-ui";
import {Visibility, VisibilityOff} from "material-ui-icons";

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        margin: theme.spacing.unit,
    },
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
                <Input value={config[MC_HOST]}
                       id="mchost"
                       label="JRMC Host"
                       className={classes.input}
                       inputProps={{
                           'aria-label': 'Description',
                       }}
                       onChange={this.handleInput(MC_HOST)}
                />
                <Input value={config[MC_PORT]}
                       id="mcport"
                       label="JRMC Port"
                       type="number"
                       className={classes.input}
                       inputProps={{
                           'aria-label': 'Description',
                       }}
                       onChange={this.handleInput(MC_PORT)}
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={config[MC_USE_SSL]}
                            onChange={this.handleSwitch(MC_USE_SSL)}
                        />
                    }
                    label="Use SSL?"
                />
                <Input value={config[MC_USERNAME]}
                       id="mcwsuser"
                       label="JRMC Username"
                       className={classes.input}
                       inputProps={{
                           'aria-label': 'Description',
                       }}
                       onChange={this.handleInput(MC_USERNAME)}
                />
                <Input
                    id="password"
                    type={this.state.showPassword ? 'text' : 'password'}
                    value={config[MC_PASSWORD]}
                    onChange={this.handleInput(MC_PASSWORD)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={this.handleClickShowPassword}
                                onMouseDown={this.handleMouseDownPassword}>
                                {this.state.showPassword ? <VisibilityOff/> : <Visibility/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {config: getConfigValues(state)};
};

export default connect(mapStateToProps)(withStyles(styles)(Config));

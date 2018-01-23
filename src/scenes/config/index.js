import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Input from 'material-ui/Input';
import {connect} from "react-redux";
import {updateValue} from "../../store/config/actions";
import {getConfig} from "../../store/config/reducer";
import * as configFields from "../../store/config/config";
import FormControl from "material-ui/Form/FormControl";
import FormControlLabel from "material-ui/Form/FormControlLabel";
import IconButton from "material-ui/IconButton";
import InputAdornment from "material-ui/Input/InputAdornment";
import InputLabel from "material-ui/Input/InputLabel";
import List, {ListItem, ListItemText} from 'material-ui/List';
import Switch from "material-ui/Switch";
import {Visibility, VisibilityOff} from "material-ui-icons";
import timer from "../../services/timer";
import Grid from "material-ui/Grid";

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
        showPassword: false,
        showTimers: true
    };

    changeDebug = () => {
        this.setState((prevState, prevProps) => {
            return {showTimers: !prevState.showTimers};
        });
    };

    handleInput = (field) => (event) => {
        this.props.updateValue(field, event.target.value);
    };

    handleSwitch = (field) => (event, checked) => {
        this.props.updateValue(field, checked);
    };

    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        this.setState((prevState, prevProps) => {
            return {showPassword: !prevState.showPassword}
        });
    };

    timerAsListItem = (p) => {
        return (
            <Grid key={p.id} item>
                <List>
                    <ListItem>
                        <ListItemText primary={p.id}/>
                    </ListItem>
                    {p.times.map(t =>
                        <ListItem key={t.toString()}>
                            <ListItemText
                                secondary={`${t.getHours()}:${t.getMinutes()}:${t.getSeconds() < 10 ? '0' : ''}${t.getSeconds()}.${t.getMilliseconds() < 10 ? '0' : ''}${t.getMilliseconds() < 100 ? '0' : ''}${t.getMilliseconds()}`}/>
                        </ListItem>
                    )}
                </List>
            </Grid>
        );
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
                    <InputLabel htmlFor="tivoname">Tivo Name</InputLabel>
                    <Input value={config[configFields.TIVO_NAME]}
                           id="tivoname"
                           label="TiVo Network Name"
                           className={classes.input}
                           inputProps={{
                               'aria-label': 'Description',
                           }}
                           onChange={this.handleInput(configFields.TIVO_NAME)}/>
                </FormControl>
                <FormControlLabel
                    control={
                        <Switch checked={this.state.showTimers}
                                onChange={this.changeDebug}/>
                    }
                    label="Show Debug Timer Info?"/>
                {
                    this.state.showTimers
                        ?
                        <Grid container>
                            {timer.getPollerData().map(p => this.timerAsListItem(p))}
                        </Grid>
                        : null
                }
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {config: getConfig(state)};
};

export default connect(mapStateToProps, {updateValue})(withStyles(styles)(Config));

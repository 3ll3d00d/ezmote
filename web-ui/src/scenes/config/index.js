import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Input from 'material-ui/Input';
import {connect} from "react-redux";
import * as configActions from '../../store/config/actions';
import {getConfigValues} from "../../store/config/reducer";

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        margin: theme.spacing.unit,
    },
});

const Config = ({dispatch, classes, url, user, pass}) => {
    const handleInput = (field) => (event) => {
        dispatch(configActions.updateValue(field, event.target.value));
    };

    return (
        <div className={classes.container}>
            <Input value={url}
                   placeholder="MCWS URL"
                   className={classes.input}
                   inputProps={{
                       'aria-label': 'Description',
                   }}
                   onChange={handleInput('url')}
            />
            <Input value={user}
                   className={classes.input}
                   inputProps={{
                       'aria-label': 'Description',
                   }}
                   onChange={handleInput('user')}
            />
            <Input value={pass}
                   className={classes.input}
                   inputProps={{
                       'aria-label': 'Description',
                   }}
                   onChange={handleInput('pass')}
            />
        </div>
    );
};

Config.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => getConfigValues(state);

export default connect(mapStateToProps)(withStyles(styles)(Config));

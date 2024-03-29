import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Input from '@mui/material/Input';
import {connect} from "react-redux";
import {updateValue} from "../../store/config/actions";
import {getTivoName} from "../../store/config/reducer";
import * as configFields from "../../store/config/config";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";

const styles = (theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    input: {
        margin: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
    },
    withoutLabel: {
        marginTop: theme.spacing(3),
    }
});

class Config extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
    };

    handleInput = (field) => (event) => {
        this.props.updateValue(field, event.target.value);
    };

    render() {
        const {classes, tivoName} = this.props;

        return (
            <div className={classes.container}>
                <FormControl variant="standard" className={classes.formControl}>
                    <InputLabel htmlFor="tivoname">Tivo Name</InputLabel>
                    <Input value={tivoName}
                           id="tivoname"
                           label="TiVo Network Name"
                           className={classes.input}
                           inputProps={{
                               'aria-label': 'Description',
                           }}
                           onChange={this.handleInput(configFields.TIVO_NAME)}/>
                </FormControl>
            </div>
        );
    };
}

const mapStateToProps = (state) => {
    return {
        tivoName: getTivoName(state),
    };
};

export default connect(mapStateToProps, {updateValue})(withStyles(styles)(Config));

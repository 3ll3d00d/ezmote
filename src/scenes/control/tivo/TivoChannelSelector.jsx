import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import withStyles from '@mui/styles/withStyles';
import {setTivoChannel} from "../../../store/tivos/actions";
import channels from "./ChannelList";
import {connect} from 'react-redux';

const styles = theme => ({
    searchBox: {
        display: 'flex',
        flex: 6,
        flexDirection: 'row'
    }
});

class TivoChannelSelector extends Component {
    getChannelName = (channelNumber) => {
        if (channelNumber) {
            const channel = channelNumber.toString();
            const match = channels.find(c => c.number === channel);
            if (match) {
                return match.name;
            }
        }
        return null;
    };

    render() {
        const {classes, currentChannel} = this.props;
        const currentChannelName = this.getChannelName(currentChannel);
        return <Autocomplete
            disablePortal
            fullWidth={true}
            sx={{ width: 250 }}
            id="tivo-channels"
            options={channels}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => <TextField {...params}
                                                label={currentChannelName ? currentChannelName : 'Select a channel'}/>}
            componentsProps={{ popper: { style: { width: 'fit-content' } } }}
        />;
    }
}

TivoChannelSelector.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {};
};
export default connect(mapStateToProps, {setTivoChannel})(withStyles(styles)(TivoChannelSelector));

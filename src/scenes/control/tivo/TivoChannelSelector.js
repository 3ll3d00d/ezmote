import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import {withStyles} from '@material-ui/core/styles';
import {getConfig} from "../../../store/config/reducer";
import {setTivoChannel} from "../../../store/tivos/actions";
import channels from "./ChannelList";
import {connect} from 'react-redux';

const renderInput = (inputProps) => {
    const {classes, disabled, autoFocus, value, ref, ...other} = inputProps;
    return (
        <TextField
            disabled={disabled}
            autoFocus={autoFocus}
            className={classes.textField}
            value={value}
            inputRef={ref}
            InputProps={{
                classes: {
                    input: classes.input,
                },
                ...other,
            }}
        />
    );
};

const renderSuggestion = (suggestion, {query, isHighlighted}) => {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);
    return (
        <MenuItem selected={isHighlighted} component="div">
            <div>
                {parts.map((part, index) => {
                    return part.highlight ? (
                        <span key={String(index)} style={{fontWeight: 300, fontSize: '0.875em'}}>
              {part.text}
            </span>
                    ) : (
                        <strong key={String(index)} style={{fontWeight: 500, fontSize: '0.875em'}}>
                            {part.text}
                        </strong>
                    );
                })}
            </div>
        </MenuItem>
    );
};

const renderSuggestionsContainer = ({containerProps, children}) => {
    return (
        <Paper {...containerProps} square style={{zIndex: 100}}>
            {children}
        </Paper>
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const styles = theme => ({
    searchBox: {
        display: 'flex',
        flex: 6,
        flexDirection: 'row'
    },
    container: {
        flexGrow: 1,
        position: 'relative'
    },
    suggestionsContainerOpen: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    suggestion: {
        display: 'block',
    },
    suggestionsList: {
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    textField: {
        width: '100%'
    },
    formControl: {
        flexGrow: 1,
        paddingRight: '10px',
        paddingBottom: '4px'
    },
    input: {
        height: '1.215em'
    }
});

class TivoChannelSelector extends Component {
    state = {
        suggestionText: '',
        suggestions: []
    };

    filterSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const regex = new RegExp(inputValue);
        const inputLength = inputValue.length;
        let count = 0;
        if (inputLength === 0) {
            return [];
        } else {
            return channels.filter(suggestion => {
                const keep = count < 8 && regex.test(suggestion.name.toLowerCase());
                if (keep) {
                    count += 1;
                }
                return keep;
            });
        }
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.currentChannel !== this.props.currentChannel) {
            this.setState({suggestionText: ''});
        }
    };

    handleSuggestionsFetchRequested = ({value, reason}) => {
        this.setState({suggestions: this.filterSuggestions(value)});
    };

    handleSuggestionsClearRequested = () => {
        this.setState({suggestions: []});
    };

    handleSuggestionChange = (event, {newValue}) => {
        this.setState({suggestionText: newValue});
    };

    handleSuggestionSelected = (event, { suggestion }) => {
        this.props.setTivoChannel(suggestion.number);
    };

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
        const currentChannelName =  this.getChannelName(currentChannel);
        const {suggestions} = this.state;
        return (
            <div className={classes.searchBox}>
                <Autosuggest
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderInputComponent={renderInput}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
                    onSuggestionSelected={this.handleSuggestionSelected}
                    renderSuggestionsContainer={renderSuggestionsContainer}
                    shouldRenderSuggestions={(value) => true}
                    getSuggestionValue={getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={{
                        autoFocus: true,
                        classes,
                        placeholder: currentChannelName ? currentChannelName : 'Select a channel',
                        value: this.state.suggestionText,
                        onChange: this.handleSuggestionChange,
                    }}/>
            </div>
        );
    }
}

TivoChannelSelector.propTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        config: getConfig(state)
    };
};
export default connect(mapStateToProps, {setTivoChannel})(withStyles(styles)(TivoChannelSelector));

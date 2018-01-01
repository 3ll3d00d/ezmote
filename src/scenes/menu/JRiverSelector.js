import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import {MenuItem} from 'material-ui/Menu';
import {withStyles} from 'material-ui/styles';
import Input from 'material-ui/Input';
import {FormControl} from 'material-ui/Form';
import Select from 'material-ui/Select';
import jriver from "../../services/jriver";
import {getActiveZone, getAuthToken} from "../../store/jriver/reducer";
import {getConfig, getJRiverURL} from "../../store/config/reducer";
import {
    browseChildren as mcwsBrowseChildren,
    browseFiles as mcwsBrowseFiles
} from '../../services/jriver/mcws';
import {startPlayback} from "../../store/jriver/actions";
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

const renderSuggestion = (rootURL, authToken) => (suggestion, {query, isHighlighted}) => {
    const matches = match(suggestion.name, query);
    const parts = parse(suggestion.name, matches);
    return (
        <MenuItem selected={isHighlighted} component="div">
            <img alt={suggestion.name}
                 src={`${rootURL}/MCWS/v1/Browse/Image?Token=${authToken}&ID=${suggestion.id}&Format=png&Width=32&Height=32&Pad=1`}
                 width={32}
                 height={32}/>
            &nbsp;&nbsp;
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
        <Paper {...containerProps} square>
            {children}
        </Paper>
    );
};

const getSuggestionValue = suggestion => suggestion.name;

const styles = theme => ({
    searchBox: {
        display: 'flex',
        flex: 3,
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

class JRiverSelector extends Component {
    state = {
        suggestionText: '',
        suggestions: [],
        categories: [],
        suggestionsByCategory: {},
        selectedCategoryId: ''
    };

    componentDidMount = async () => {
        await this.loadCategories(this.props.categoryId);
    };

    componentWillReceiveProps = async (nextProps) => {
        if (nextProps.categoryId !== this.props.categoryId) {
            await this.loadCategories(nextProps.categoryId);
        }
    };

    loadCategories = async (categoryId) => {
        const categories = await this.getChildren(categoryId);
        const childCategories = await Promise.all(categories.children.map(c => this.getChildren(c.id)));
        const selectedCategoryId = categories.children.length > 0 ? categories.children[0].id : '';
        const suggestions = categories.children.length > 0 ? childCategories[0].children : [];
        this.setState({
            categories,
            suggestionsByCategory: childCategories,
            selectedCategoryId,
            suggestions
        });
    };

    getChildren = async (nodeId) => {
        const {config, authToken} = this.props;
        if (config.valid === true) {
            // TODO try-catch
            let response = await jriver.invoke({authToken, ...mcwsBrowseChildren(config, nodeId)});
            if (response.length === 0) {
                response = await jriver.invoke({authToken, ...mcwsBrowseFiles(config, nodeId, 'MPL')});
            }
            return {parent: nodeId, children: response};
        }
        return {parent: nodeId, children: []};
    };

    filterSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;
        const {selectedCategoryId, suggestionsByCategory} = this.state;
        const suggestions = this.getUnfilteredSuggestions(suggestionsByCategory, selectedCategoryId);
        if (inputLength === 0) {
            return suggestions;
        } else if (inputLength === '*') {
            return suggestions;
        } else {
            return suggestions.filter(suggestion => {
                const keep =
                    count < 8 && suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;
                if (keep) {
                    count += 1;
                }
                return keep;
            });
        }
    };

    handleSuggestionsFetchRequested = ({value, reason}) => {
        this.setState({suggestions: this.filterSuggestions(value)});
    };

    handleSuggestionsClearRequested = () => {
        const {selectedCategoryId, suggestionsByCategory} = this.state;
        this.setState({suggestions: this.getUnfilteredSuggestions(suggestionsByCategory, selectedCategoryId)});
    };

    getUnfilteredSuggestions = (suggestionsByCategory, selectedCategoryId) => {
        const suggestions = suggestionsByCategory.find(s => s.parent === selectedCategoryId);
        return suggestions ? suggestions.children : [];
    };

    handleSuggestionChange = (event, {newValue}) => {
        this.setState({suggestionText: newValue});
    };

    handleCategoryChange = event => {
        const value = event.target.value;
        this.setState((prevState, prevProps) => {
            return {
                [event.target.name]: value,
                suggestions: this.getUnfilteredSuggestions(prevState.suggestionsByCategory, value),
                suggestionText: ''
            };
        });
    };

    handleSuggestionSelected = (event, { suggestion }) => {
        this.props.startPlayback(suggestion.id);
    };

    render() {
        const {classes, authToken, jriverURL} = this.props;
        const {categories, selectedCategoryId, suggestions} = this.state;
        const children = categories.children ? categories.children : [];
        return (
            <div className={classes.searchBox}>
                <FormControl className={classes.formControl}>
                    <Select
                        value={this.state.selectedCategoryId}
                        onChange={this.handleCategoryChange}
                        input={<Input name="selectedCategoryId" id="search-category"/>}>
                        {
                            children.map(c => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)
                        }
                    </Select>
                </FormControl>
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
                    renderSuggestion={renderSuggestion(jriverURL, authToken)}
                    inputProps={{
                        autoFocus: true,
                        classes,
                        placeholder: 'Search',
                        disabled: selectedCategoryId === '',
                        value: this.state.suggestionText,
                        onChange: this.handleSuggestionChange,
                    }}/>
            </div>
        );
    }
}

JRiverSelector.propTypes = {
    classes: PropTypes.object.isRequired,
    categoryId: PropTypes.number.isRequired
};

const mapStateToProps = (state) => {
    return {
        activeZone: getActiveZone(state),
        authToken: getAuthToken(state),
        config: getConfig(state),
        jriverURL: getJRiverURL(state)
    };
};
export default connect(mapStateToProps, {startPlayback})(withStyles(styles)(JRiverSelector));

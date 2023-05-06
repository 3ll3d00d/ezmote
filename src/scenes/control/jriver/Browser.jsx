import React, {Component} from 'react';
import withStyles from '@mui/styles/withStyles';
import {withTheme} from '@mui/styles';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import {AutoSizer, InfiniteLoader, List} from "react-virtualized";
import {connect} from "react-redux";
import debounce from 'lodash.debounce';
import {browseChildren as mcwsBrowseChildren, browseFiles as mcwsBrowseFiles} from "../../../services/jriver/mcws";
import jriver from "../../../services/jriver";
import {getAuthToken, getJRiverURL} from "../../../store/jriver/reducer";
import {startPlayback} from "../../../store/jriver/actions";
import {sendCommand} from "../../../store/commands/actions";
import Breadcrumbs from './Breadcrumbs';
import PlayableCard from "./PlayableCard";
import Search from "./Search";
import useMediaQuery from "@mui/material/useMediaQuery/useMediaQuery";

const styles = theme => ({
    fullsize: {
        marginTop: theme.spacing(1),
        width: '100%',
        height: '100%',
        // backgroundColor: theme.palette.background.default,
    },
    landscape: {
        height: '100%',
        // backgroundColor: theme.palette.background.default,
    },
    autosize: {
        flex: '1 1 auto'
    },
});

const hexToRGB = h => {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (h.length === 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];
        // 6 digits
    } else if (h.length === 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }
    return `${+r},${+g},${+b}`;
};

const Header = withStyles(styles)(({path, names, onSelectNode, selectedCommand, classes, handleInput, text}) => {
    return useMediaQuery('(orientation: landscape) and (min-height: 580px)')
        ?
        <Grid container>
            <Grid item>
                <Breadcrumbs path={path}
                             names={names}
                             onSelect={onSelectNode}
                             selectedCommand={selectedCommand}/>
            </Grid>
            <Grid item xs={1}/>
            <Grid item className={classes.landscape}>
                <Search text={text} onChange={handleInput}/>
            </Grid>
        </Grid>
        :
        <>
            <Grid container>
                <Grid item>
                    <Breadcrumbs path={path}
                                 names={names}
                                 onSelect={onSelectNode}
                                 selectedCommand={selectedCommand}/>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item className={classes.fullsize}>
                    <Search text={text} onChange={handleInput}/>
                </Grid>
            </Grid>
        </>
        ;
});

class Browser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            nodes: [],
            filtered: [],
            details: new Map(),
            names: new Map(),
            path: [],
            fallbackColour: hexToRGB(props.theme.palette.secondary.main)
        }
    };

    doSearch = () => {
        this.setState((prevState, prevProps) => {
            const txt = prevState.text.toLowerCase();
            return {filtered: prevState.nodes.filter(n => n.name.toLowerCase().indexOf(txt) !== -1)}
        }, this.forceReload);
    };

    debounceSearch = debounce(this.doSearch, 500, {leading: false, trailing: true});

    componentDidMount = async () => {
        if (this.props.selectedCommand) {
            await this.onSelectNode(this.props.selectedCommand.nodeId);
        }
    };

    componentDidUpdate = async (prevProps, prevState, snapshot) => {
        const {selectedCommand} = this.props;
        if (selectedCommand && selectedCommand.nodeId !== prevProps.selectedCommand.nodeId) {
            await this.onSelectNode(selectedCommand.nodeId, true);
        }
    };

    onPlayNode = (type, id) => {
        const {onPlay, sendCommand, selectedCommand, startPlayback} = this.props;
        sendCommand(selectedCommand);
        startPlayback(type, id);
        onPlay();
    };

    onSelectNode = async (nodeId, resetPath = false) => {
        await this.onLoadNode(nodeId, resetPath);
    };

    forceReload = () => {
        this.InfLoader.resetLoadMoreRowsCache(true);
        this.List.forceUpdateGrid();
    };

    onLoadNode = async (nodeId, resetPath, onStateChange) => {
        const children = await this.getChildren(nodeId);
        this.setState((prevState, prevProps) => {
            let newState = {nodes: children, filtered: children, text: ''};
            if (nodeId && prevProps.selectedCommand && nodeId !== prevProps.selectedCommand.nodeId) {
                const idx = prevState.path.indexOf(nodeId);
                const newPath = idx === -1 ? prevState.path.concat([nodeId]) : prevState.path.slice(0, idx + 1);
                return Object.assign(newState, {path: newPath});
            } else if (resetPath) {
                return Object.assign(newState, {path: []});
            } else {
                return newState;
            }
        }, this.forceReload);
    };

    handleInput = (event) => {
        this.setState({text: event.target.value}, this.debounceSearch);
    };

    getChildren = async (nodeId) => {
        const {serverURL, token} = this.props;
        const args = mcwsBrowseChildren(serverURL, nodeId);
        let response = await jriver.invoke({token, ...args});
        if (response.length === 0) {
            response = await jriver.invoke({token, ...mcwsBrowseFiles(serverURL, nodeId)});
        }
        return response;
    };

    isRowLoaded = ({index}) => {
        const {details, filtered} = this.state;
        return details.has(filtered[index].id);
    };

    convertNode = c => {
        return [
            c.id,
            c.name,
            <PlayableCard content={c}
                          width={96}
                          height={96}
                          onSelect={this.onSelectNode}
                          onPlay={this.onPlayNode}
                          classes={this.props.classes}
                          mcwsUrl={`${this.props.serverURL}/MCWS/v1`}
                          fallbackColour={this.state.fallbackColour}
                          authToken={this.props.token}/>
        ];
    };

    loadMoreRows = async ({startIndex, stopIndex}) => {
        const nodesToLoad = this.state.filtered.slice(startIndex, stopIndex + 1);
        const loadedNodes = await Promise.all(nodesToLoad.map(c => this.convertNode(c)));
        this.setState((prevState, prevProps) => {
            const newDetails = prevState.details;
            const newNames = prevState.names;
            loadedNodes.forEach(n => {
                newDetails.set(n[0], n[2]);
                newNames.set(n[0], n[1]);
            });
            return {
                details: newDetails,
                names: newNames
            };
        });
    };

    renderRow = ({key, index, style}) => {
        const {filtered, details} = this.state;
        const id = filtered[index].id;
        return (
            <div key={key} style={style}>
                {details.get(id)}
            </div>
        )
    };

    render() {
        const {path, filtered, text, names} = this.state;
        const {classes, nodeId, selectedCommand} = this.props;
        const rowCount = filtered.length;
        const availableHeight = document.documentElement.clientHeight - 205 - (path.length === 0 ? 0 : 90);
            return (
            <Grid container>
                {
                    path.length > 0
                    ?
                        <Header path={path}
                                names={names}
                                onSelectNode={this.onSelectNode}
                                selectedCommand={selectedCommand}
                                classes={classes}
                                handleInput={this.handleInput}
                                text={text}/>
                    :
                        null
                }
                <Grid container>
                    <Grid item className={classes.autosize}>
                        <Paper className={classes.fullsize} elevation={0}>
                            <InfiniteLoader key={path.length > 0 ? path[path.length - 1] : nodeId}
                                            isRowLoaded={this.isRowLoaded}
                                            loadMoreRows={this.loadMoreRows}
                                            rowCount={rowCount}
                                            ref={ref => { this.InfLoader = ref; }}>
                                {({onRowsRendered, registerChild}) => (
                                    <div style={{ flex: '1 1 auto', height: `${availableHeight}px`}}>
                                        <AutoSizer disableHeight={true}>
                                            {({ height, width }) => (
                                                <List height={availableHeight}
                                                      onRowsRendered={onRowsRendered}
                                                      ref={ref => { this.List = ref; registerChild(ref); }}
                                                      rowCount={rowCount}
                                                      rowHeight={120}
                                                      rowRenderer={this.renderRow}
                                                      width={width}/>
                                            )}
                                        </AutoSizer>
                                    </div>
                                )}
                            </InfiniteLoader>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: getAuthToken(state),
        serverURL: getJRiverURL(state)
    };
};

const styledBrowser = withTheme(withStyles(styles, {withTheme: true})(Browser));
export default connect(mapStateToProps, {startPlayback, sendCommand})(styledBrowser);
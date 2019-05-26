import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {withTheme} from '@material-ui/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import {AutoSizer, InfiniteLoader, List} from "react-virtualized";
import {connect} from "react-redux";
import debounce from 'lodash.debounce';
import {browseChildren as mcwsBrowseChildren, browseFiles as mcwsBrowseFiles} from "../../../services/jriver/mcws";
import jriver from "../../../services/jriver";
import {getAuthToken} from "../../../store/jriver/reducer";
import {startPlayback} from "../../../store/jriver/actions";
import {getConfig, getJRiverURL} from "../../../store/config/reducer";
import {sendCommand} from "../../../store/commands/actions";
import Breadcrumbs from './Breadcrumbs';
import PlayableCard from "./PlayableCard";
import Search from "./Search";

const styles = theme => ({
    fullsize: {
        marginTop: theme.spacing(1),
        width: '100%',
        height: '100%'
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

class Browser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            nodes: [],
            details: new Map(),
            names: new Map(),
            path: [],
            fallbackColour: hexToRGB(props.theme.palette.secondary.main)
        }
    };

    doSearch = () => {
        console.log(`Searching for ${this.state.text}`);
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

    onSelectNode = async (nodeId, resetPath = false) => {
        await this.onLoadNode(nodeId, resetPath);
        this.InfLoader.resetLoadMoreRowsCache(true);
        this.List.forceUpdateGrid();
    };

    onLoadNode = async (nodeId, resetPath) => {
        const children = await this.getChildren(nodeId);
        this.setState((prevState, prevProps) => {
            let newState = {nodes: children};
            if (nodeId && prevProps.selectedCommand && nodeId !== prevProps.selectedCommand.nodeId) {
                const idx = prevState.path.indexOf(nodeId);
                const newPath = idx === -1 ? prevState.path.concat([nodeId]) : prevState.path.slice(0, idx + 1);
                return Object.assign(newState, {path: newPath});
            } else if (resetPath) {
                return Object.assign(newState, {path: []});
            } else {
                return newState;
            }
        });
    };

    handleInput = (event) => {
        this.setState({text: event.target.value}, this.debounceSearch);
    };

    getChildren = async (nodeId) => {
        const {config, authToken} = this.props;
        if (config.valid === true) {
            // TODO try-catch
            const args = mcwsBrowseChildren(config, nodeId);
            let response = await jriver.invoke({authToken, ...args});
            if (response.length === 0) {
                response = await jriver.invoke({authToken, ...mcwsBrowseFiles(config, nodeId)});
            }
            return response;
        }
        return [];
    };

    isRowLoaded = ({index}) => {
        const {details, nodes} = this.state;
        return details.has(nodes[index].id);
    };

    convertNode = c => {
        return [
            c.id,
            c.name,
            <PlayableCard type={c.type}
                          name={c.name}
                          id={c.id}
                          width={96}
                          height={96}
                          onSelect={this.onSelectNode}
                          classes={this.props.classes}
                          mcwsUrl={`${this.props.jriverURL}/MCWS/v1`}
                          fallbackColour={this.state.fallbackColour}
                          authToken={this.props.authToken}/>
        ];
    };

    loadMoreRows = async ({startIndex, stopIndex}) => {
        const nodesToLoad = this.state.nodes.slice(startIndex, stopIndex + 1);
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
        const {nodes, details} = this.state;
        const id = nodes[index].id;
        return (
            <div key={key} style={style}>
                {details.get(id)}
            </div>
        )
    };

    render() {
        const {path, nodes, text, names} = this.state;
        const {classes, nodeId, selectedCommand} = this.props;
        return (
            <Grid container>
                {
                    path.length > 0
                    ?
                        <>
                            <Grid container>
                                <Grid item>
                                    <Breadcrumbs path={path}
                                                 names={names}
                                                 onSelect={this.onSelectNode}
                                                 selectedCommand={selectedCommand}/>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item className={classes.fullsize}>
                                    <Search text={text} onChange={this.handleInput}/>
                                </Grid>
                            </Grid>
                        </>
                    :
                        null
                }
                <Grid container>
                    <Grid item className={classes.autosize}>
                        <Paper className={classes.fullsize}>
                            <InfiniteLoader key={path.length > 0 ? path[path.length - 1] : nodeId}
                                            isRowLoaded={this.isRowLoaded}
                                            loadMoreRows={this.loadMoreRows}
                                            rowCount={nodes.length}
                                            ref={ref => { this.InfLoader = ref; }}>
                                {({onRowsRendered, registerChild}) => (
                                    <div style={{ flex: '1 1 auto' , height: '100vh'}}>
                                        <AutoSizer>
                                            {({ height, width }) => (
                                                <List height={height}
                                                      onRowsRendered={onRowsRendered}
                                                      ref={ref => { this.List = ref; registerChild(ref); }}
                                                      rowCount={nodes.length}
                                                      rowHeight={104}
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
        authToken: getAuthToken(state),
        config: getConfig(state),
        jriverURL: getJRiverURL(state)
    };
};

const styledBrowser = withTheme(withStyles(styles, {withTheme: true})(Browser));
export default connect(mapStateToProps, {startPlayback, sendCommand})(styledBrowser);
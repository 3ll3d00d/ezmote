import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import classNames from 'classnames';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import IconButton from '@material-ui/core/IconButton';
import AppsIcon from '@material-ui/icons/Apps';
import SettingsIcon from '@material-ui/icons/Settings';
import ProjectorIcon from '@material-ui/icons/Videocam';
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import ExitFullScreenIcon from '@material-ui/icons/FullscreenExit';
import RadioIcon from '@material-ui/icons/Radio';
import PlaylistIcon from '@material-ui/icons/PlaylistPlay';
import MovieIcon from '@material-ui/icons/Movie';
import MusicIcon from '@material-ui/icons/LibraryMusic';
import BugIcon from '@material-ui/icons/BugReport';
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar/Avatar";
import {SETTINGS, SHOW_PJ} from "../../App";

const drawerWidth = 56;

const styles = rootHeight => theme => ({
    root: {
        width: '100%',
        height: rootHeight,
        marginTop: '0px',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%'
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    selected: {
        borderLeft: '3px solid',
        borderRadius: '20px',
        color: theme.palette.secondary.light
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbarSpacer: {
        minHeight: '48px'
    },
    content: {
        width: '100%',
        height: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        paddingLeft: '8px',
        paddingTop: '8px',
        paddingRight: '8px',
        paddingBottom: '0px'
    },
    title: {
        flex: 1,
        paddingLeft: '0.5em',
        paddingRight: '0.5em'
    },
    appToolbar: {
        justifyContent: 'space-evenly'
    },
    avatar: {
        font: 'inherit',
        fontSize: '0.75em',
        borderRadius: '33%'
    },
    icon: {
        width: '40px',
        height: '40px',
    },
    listItem: {
        paddingLeft: '8px'
    },
    commandList: {
        paddingTop: '0px'
    }
});

class Menu extends Component {
    makeAvatarItem = (c, classes) => {
        return (
            <ListItemAvatar>
                <Avatar alt={c.id}
                        src={c.icon}
                        className={classes}/>
            </ListItemAvatar>
        );
    };

    makeIconItem = (c, classes) => {
        const Icon = this.findIcon(c);
        return (
            <ListItemIcon>
                <Icon className={classes}/>
            </ListItemIcon>
        );
    };

    findIcon = (c) => {
        switch (c.icon) {
            case '/icons/mi/radio':
                return RadioIcon;
            case '/icons/mi/playlist play':
                return PlaylistIcon;
            case '/icons/mi/library_music':
                return MusicIcon;
            case '/icons/mi/movie':
                return MovieIcon;
            case '/icons/mi/close':
                return PowerIcon;
            default:
                return BugIcon;
        }
    };

    renderCommandButton = (c, selectedCommand, classes, handler) => {
        return (
            <ListItem button
                      className={classes.listItem}
                      key={c.id}
                      onClick={() => handler(c)}
                      selected={selectedCommand && selectedCommand.id === c.id}>
                {c.icon.startsWith('/icons/mi')
                    ? this.makeIconItem(c, classes.icon)
                    : this.makeAvatarItem(c, classNames(classes.avatar, classes.icon))}
            </ListItem>
        );
    };

    render() {
        const {commands, selectedCommand, classes, handler, fullscreen, toggleFullScreen, showTheatreView, children} = this.props;
        const drawer = (
            <Drawer variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    className={classes.drawer}>
                <div className={classes.toolbarSpacer} />
                <List className={classes.commandList}>
                    {commands.filter(c => c).map(c => this.renderCommandButton(c, selectedCommand, classes, handler))}
                </List>
            </Drawer>
        );
        const fsIcon = fullscreen ? <ExitFullScreenIcon/> : <FullScreenIcon/>;
        const fsRoot = fullscreen ? classes.root : Object.assign(classes.root, {height: window.innerHeight});
        return (
            <div className={fsRoot}>
                <div className={classes.appFrame}>
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar className={classes.appToolbar} variant={'dense'}>
                            <IconButton aria-owns={'menu-appbar'}
                                        aria-haspopup='true'
                                        onClick={() => handler(SHOW_PJ)}
                                        color='inherit'>
                                <ProjectorIcon/>
                            </IconButton>
                            <IconButton aria-owns={'menu-appbar'}
                                        aria-haspopup='true'
                                        onClick={() => handler(SETTINGS)}
                                        color='inherit'>
                                <SettingsIcon/>
                            </IconButton>
                            <IconButton aria-owns={'menu-appbar'}
                                        aria-haspopup='true'
                                        onClick={showTheatreView}
                                        color='inherit'>
                                <AppsIcon/>
                            </IconButton>
                            <IconButton aria-owns={'menu-appbar'}
                                        aria-haspopup="true"
                                        onClick={toggleFullScreen}
                                        color="inherit">
                                {fsIcon}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {drawer}
                    <main className={classes.content}>
                        <div className={classes.toolbarSpacer} />
                        {children}
                    </main>
                    {/*{drawer}*/}
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    handler: PropTypes.func.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toggleFullScreen: PropTypes.func.isRequired,
    showTheatreView: PropTypes.func.isRequired,
    commands: PropTypes.array.isRequired,
    selectedCommand: PropTypes.object,
};

// 100% works in fullscreen, window.innerHeight works otherwise
// can't access props though due to https://github.com/mui-org/material-ui/issues/7633
export const FullScreenMenu = withStyles(styles('100%'), {withTheme: true})(Menu);
export const NotFullScreenMenu = withStyles(styles(window.innerHeight), {withTheme: true})(Menu);
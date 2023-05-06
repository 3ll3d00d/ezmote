import React, {Component} from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import classNames from 'classnames';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import AppsIcon from '@mui/icons-material/Apps';
import SettingsIcon from '@mui/icons-material/Settings';
import ProjectorIcon from '@mui/icons-material/Videocam';
import PowerIcon from '@mui/icons-material/PowerSettingsNew';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import ExitFullScreenIcon from '@mui/icons-material/FullscreenExit';
import RadioIcon from '@mui/icons-material/Radio';
import PlaylistIcon from '@mui/icons-material/PlaylistPlay';
import MovieIcon from '@mui/icons-material/Movie';
import MusicIcon from '@mui/icons-material/LibraryMusic';
import BugIcon from '@mui/icons-material/BugReport';
import ListItemButton from "@mui/material/ListItemButton";
import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar/Avatar";

import {SETTINGS, SHOW_PJ, TIVO} from "../../Constants";

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
            <ListItemButton className={classes.listItem}
                            key={c.id}
                            onClick={() => handler(c)}
                            selected={selectedCommand && selectedCommand.id === c.id}>
                {c.icon.startsWith('/icons/mi')
                    ? this.makeIconItem(c, classes.icon)
                    : this.makeAvatarItem(c, classNames(classes.avatar, classes.icon))}
            </ListItemButton>
        );
    };

    render() {
        const {
            commands,
            selectedCommand,
            classes,
            handler,
            fullscreen,
            toggleFullScreen,
            showTheatreView,
            children
        } = this.props;
        const drawer = (
            <Drawer variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    className={classes.drawer}>
                <div className={classes.toolbarSpacer}/>
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
                            <IconButton
                                aria-owns={'menu-appbar'}
                                aria-haspopup='true'
                                onClick={() => handler(SHOW_PJ)}
                                color='inherit'
                                size="large">
                                <ProjectorIcon/>
                            </IconButton>
                            <IconButton
                                aria-owns={'menu-appbar'}
                                aria-haspopup='true'
                                onClick={() => handler(SETTINGS)}
                                color='inherit'
                                size="large">
                                <SettingsIcon/>
                            </IconButton>
                            <IconButton
                                aria-owns={'menu-appbar'}
                                aria-haspopup='true'
                                onClick={showTheatreView}
                                color='inherit'
                                size="large">
                                <AppsIcon/>
                            </IconButton>
                            <IconButton
                                aria-owns={'menu-appbar'}
                                aria-haspopup='true'
                                onClick={() => handler(TIVO)}
                                color='inherit'
                                size="large">
                                <SettingsRemoteIcon/>
                            </IconButton>
                            <IconButton
                                aria-owns={'menu-appbar'}
                                aria-haspopup="true"
                                onClick={toggleFullScreen}
                                color="inherit"
                                size="large">
                                {fsIcon}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {drawer}
                    <main className={classes.content}>
                        <div className={classes.toolbarSpacer}/>
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
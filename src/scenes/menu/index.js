import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import SettingsIcon from 'material-ui-icons/Settings';
import PowerIcon from 'material-ui-icons/PowerSettingsNew';
import FullScreenIcon from 'material-ui-icons/Fullscreen';
import ExitFullScreenIcon from 'material-ui-icons/FullscreenExit';
import RadioIcon from 'material-ui-icons/Radio';
import PlaylistIcon from 'material-ui-icons/PlaylistPlay';
import MovieIcon from 'material-ui-icons/Movie';
import MusicIcon from 'material-ui-icons/LibraryMusic';
import BugIcon from 'material-ui-icons/BugReport';
import ListItem from "material-ui/List/ListItem";
import ListItemIcon from "material-ui/List/ListItemIcon";
import ListItemText from "material-ui/List/ListItemText";
import ListItemAvatar from "material-ui/List/ListItemAvatar";
import Avatar from "material-ui/Avatar/Avatar";
import {SETTINGS} from "../../App";

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
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        left: `${drawerWidth}px`,
        paddingRight: `${drawerWidth}px`,
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
    drawerPaper: {
        position: 'relative',
        height: '100%',
        width: drawerWidth,
        overflowX: 'hidden',
    },
    drawerInner: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: '8px',
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 64px)',
            marginTop: 64,
        },
    },
    title: {
        flex: 1,
        paddingLeft: '0.5em',
        paddingRight: '0.5em'
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
        const isSelected = selectedCommand && selectedCommand.id === c.id;
        const listItemClass = isSelected ? classNames(classes.selected, classes.listItem) : classes.listItem;
        return (
            <ListItem button
                      className={listItemClass}
                      key={c.id}
                      onClick={() => handler(c)}>
                {c.icon.startsWith('/icons/mi')
                    ? this.makeIconItem(c, classes.icon)
                    : this.makeAvatarItem(c, classNames(classes.avatar, classes.icon))}
                <ListItemText primary={c.id}/>
            </ListItem>
        );
    };

    render() {
        const {commands, selector, selectedCommand, selectorTitle, classes, handler, fullscreen, toggleFullScreen, children} = this.props;
        const drawer = (
            <Drawer type="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    open={false}>
                <div className={classes.drawerInner}>
                    <div className={classes.drawerHeader}/>
                    <List className={classes.list}>
                        <ListItem button
                                  key={SETTINGS}
                                  onClick={() => handler(SETTINGS)}
                                  className={classes.listItem}>
                            <ListItemIcon>
                                <SettingsIcon className={classes.icon}/>
                            </ListItemIcon>
                            <ListItemText primary={SETTINGS}/>
                        </ListItem>
                        {commands.map(c => this.renderCommandButton(c, selectedCommand, classes, handler))}
                    </List>
                </div>
            </Drawer>
        );
        const fsIcon = fullscreen ? <ExitFullScreenIcon/> : <FullScreenIcon/>;
        const fsRoot = fullscreen ? classes.root : Object.assign(classes.root, {height: window.innerHeight});
        return (
            <div className={fsRoot}>
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar)}>
                        <Toolbar disableGutters={true}>
                            <Typography type="subheading" color="inherit" className={classes.title}>
                                {selectorTitle}
                            </Typography>
                            {selector}
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
                        {children}
                    </main>
                </div>
            </div>
        );
    }
}

Menu.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    handler: PropTypes.func.isRequired,
    selectorTitle: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toggleFullScreen: PropTypes.func.isRequired,
    commands: PropTypes.array.isRequired,
    selectedCommand: PropTypes.object,
    selector: PropTypes.any,
};

// 100% works in fullscreen, window.innerHeight works otherwise
// can't access props though due to https://github.com/mui-org/material-ui/issues/7633
export const FullScreenMenu = withStyles(styles('100%'), {withTheme: true})(Menu);
export const NotFullScreenMenu = withStyles(styles(window.innerHeight), {withTheme: true})(Menu);
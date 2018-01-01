import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import classNames from 'classnames';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import List from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import SettingsIcon from 'material-ui-icons/Settings';
import SettingsRemoteIcon from 'material-ui-icons/SettingsRemote';
import VideoLibraryIcon from 'material-ui-icons/VideoLibrary';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import ChevronRightIcon from 'material-ui-icons/ChevronRight';
import FullScreenIcon from 'material-ui-icons/Fullscreen';
import ExitFullScreenIcon from 'material-ui-icons/FullscreenExit';
import ListItem from "material-ui/List/ListItem";
import ListItemIcon from "material-ui/List/ListItemIcon";
import ListItemText from "material-ui/List/ListItemText";
import Search from "../selector/JRiverSelector";

const drawerWidth = 160;

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
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'appBarShift-left': {
        marginLeft: drawerWidth,
    },
    'appBarShift-right': {
        marginRight: drawerWidth,
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        height: '100%',
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        width: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height: 'calc(100% - 56px)',
        marginTop: 56,
        [theme.breakpoints.up('sm')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64,
            },
        },
    },
    flex: {
        flex: 1
    },
    'content-left': {
        marginLeft: -drawerWidth,
    },
    'content-right': {
        marginRight: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    'contentShift-left': {
        marginLeft: 0,
    },
    'contentShift-right': {
        marginRight: 0,
    },
});

class Menu extends Component {
    state = {
        open: false
    };

    handleDrawerOpen = () => {
        this.setState({open: true});
    };

    handleDrawerClose = () => {
        this.setState({open: false});
    };

    render() {
        const {selected, classes, theme, handler, fullscreen, toggleFullScreen, children} = this.props;
        const {open} = this.state;

        const drawer = (
            <Drawer
                type="persistent"
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor='left'
                open={open}>
                <div className={classes.drawerInner}>
                    <div className={classes.drawerHeader}>
                        <IconButton onClick={this.handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                        </IconButton>
                    </div>
                    <Divider/>
                    <List className={classes.list}>
                        <ListItem button onClick={() => handler('Settings')}>
                            <ListItemIcon>
                                <SettingsIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Settings"/>
                        </ListItem>
                        <ListItem button onClick={() => handler('Control')}>
                            <ListItemIcon>
                                <SettingsRemoteIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Control"/>
                        </ListItem>
                        <ListItem button onClick={() => handler('Source')}>
                            <ListItemIcon>
                                <VideoLibraryIcon/>
                            </ListItemIcon>
                            <ListItemText primary="Source"/>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
        );
        const fsIcon = fullscreen ? <ExitFullScreenIcon/> : <FullScreenIcon/>;
        const fsRoot = fullscreen ? classes.root : Object.assign(classes.root, {height: window.innerHeight});
        return (
            <div className={fsRoot}>
                <div className={classes.appFrame}>
                    <AppBar className={classNames(classes.appBar, {
                        [classes.appBarShift]: open,
                        [classes['appBarShift-left']]: open,
                    })}>
                        <Toolbar disableGutters={!open}>
                            <IconButton
                                color="contrast"
                                aria-label="open drawer"
                                onClick={this.handleDrawerOpen}
                                className={classNames(classes.menuButton, open && classes.hide)}>
                                <MenuIcon/>
                            </IconButton>
                            <Typography type="title" color="inherit" noWrap className={classes.flex}>
                                {selected}
                            </Typography>
                            {/*TODO work out which search to use*/}
                            <Search categoryId={1}/>
                            <IconButton
                                aria-owns={open ? 'menu-appbar' : null}
                                aria-haspopup="true"
                                onClick={toggleFullScreen}
                                color="contrast">
                                {fsIcon}
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                    {drawer}
                    <main
                        className={classNames(classes.content, classes['content-left'], {
                            [classes.contentShift]: open,
                            [classes['contentShift-left']]: open,
                        })}>
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
    selected: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    toggleFullScreen: PropTypes.func.isRequired
};

// 100% works in fullscreen, window.innerHeight works otherwise
// can't access props though due to https://github.com/mui-org/material-ui/issues/7633
export const FullScreenMenu = withStyles(styles('100%'), {withTheme: true})(Menu);
export const NotFullScreenMenu = withStyles(styles(window.innerHeight), {withTheme: true})(Menu);
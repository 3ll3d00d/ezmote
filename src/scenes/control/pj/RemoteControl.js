import React, {Component} from 'react';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import UpArrow from '@material-ui/icons/ArrowUpward';
import Info from '@material-ui/icons/Info';
import Power from '@material-ui/icons/Power';
import PowerOff from '@material-ui/icons/PowerOff';
import DownArrow from '@material-ui/icons/ArrowDownward';
import LeftArrow from '@material-ui/icons/ArrowBack';
import RightArrow from '@material-ui/icons/ArrowForward';
import Check from '@material-ui/icons/Check';
import Menu from '@material-ui/icons/Menu';
import AdvancedMenu from '@material-ui/icons/MoreVert';
import Back from '@material-ui/icons/ChevronLeft';
import HdrOn from '@material-ui/icons/HdrOn';
import HdrOff from '@material-ui/icons/HdrOff';
import ScopeAspect from '@material-ui/icons/Crop75';
import TVAspect from '@material-ui/icons/Crop32';
import {withStyles} from "@material-ui/core/styles/index";
import classNames from 'classnames';
import {getConfig} from "../../../store/config/reducer";
import {connect} from "react-redux";
import {sendCommandToPJ} from "../../../store/pj/actions";

const styles = (theme) => ({
    input: {
        margin: theme.spacing(1)
    },
    formControl: {
        margin: theme.spacing(1),
    },
    padded: {
        marginTop: '1em',
    },
    smallPadded: {
        marginTop: '0.25em',
        marginBottom: '0.25em'
    },
    bordered: {
        borderBottom: '1px solid black'
    },
    rcButton: {
        minWidth: '32px'
    }
});

class RemoteControl extends Component {

    makeRCButton = (key, CI) => {
        return (
            <Button key={key}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => this.props.sendCommandToPJ(key)}
                    className={this.props.classes.rcButton}>
                <CI/>
            </Button>
        );
    };

    render() {
        const {classes} = this.props;

        return (
            <Grid container className={classes.bordered} spacing={1}>
                <Grid container justify={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                    <Grid item>
                        <Grid container direction={'column'} justify={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {this.makeRCButton('Power.PowerState.LampOn', Power)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.Menu_Info', Info)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Power.PowerState.Standby', PowerOff)}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container justify={'space-around'} alignItems={'center'} spacing={1}>
                            <Grid item>
                                <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.PictureMode_Natural', HdrOff)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Up', UpArrow)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.PictureMode_User2', HdrOn)}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Left', LeftArrow)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.OK', Check)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Right', RightArrow)}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Back', Back)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Down', DownArrow)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Menu', Menu)}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={'column'} justify={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.InstallationMode1', TVAspect)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.InstallationMode2', ScopeAspect)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.Menu_Advanced', AdvancedMenu)}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        config: getConfig(state),
    };
};
export default connect(mapStateToProps, {
    sendCommandToPJ,
})(withStyles(styles, {withTheme: true})(RemoteControl));

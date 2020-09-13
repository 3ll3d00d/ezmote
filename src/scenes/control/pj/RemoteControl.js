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
import ScopeStreamAspect from '@material-ui/icons/PanoramaHorizontal';
import Error from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import {withStyles} from "@material-ui/core/styles/index";
import {getConfig} from "../../../store/config/reducer";
import {connect} from "react-redux";
import {
    clearPowerState,
    getAnamorphicModeFromPJ,
    getPictureModeFromPJ,
    getPowerStateFromPJ,
    sendCommandToPJ
} from "../../../store/pj/actions";
import {getAnamorphicMode, getPictureMode, getPowerState} from "../../../store/pj/reducer";
import poller from "../../../services/timer";

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

    pollForPowerState = () => {
        if (!poller.isPolling('pj-power')) {
            console.info(`Starting pj-power poller on ${this.props.powerState}`);
            poller.startPolling('pj-power', this.props.getPowerStateFromPJ, 500);
            return true;
        }
        return false;
    }

    pollForPictureMode = () => {
        if (!poller.isPolling('pj-picture')) {
            console.info('Starting pj-picture poller');
            poller.startPolling('pj-picture', this.props.getPictureModeFromPJ, 500);
            return true;
        }
        return false;
    }

    pollForAnamorphic = () => {
        if (!poller.isPolling('pj-anamorphic')) {
            console.info('Starting pj-anamorphic poller');
            poller.startPolling('pj-anamorphic', this.props.getAnamorphicModeFromPJ, 500);
            return true;
        }
        return false;
    }

    componentDidMount = () => {
        this.props.getPowerStateFromPJ();
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.powerState !== this.props.powerState) {
            if (this.props.powerState === 'LampOn') {
                this.props.getAnamorphicModeFromPJ();
                this.props.getPictureModeFromPJ();
                poller.stopPolling('pj-power')
            } else if (this.props.powerState === 'Standby') {
                poller.stopPolling('pj-power')
            } else {
                this.pollForPowerState();
            }
        }
        if (poller.isPolling('pj-picture') && prevProps.pictureMode !== this.props.pictureMode) {
            poller.stopPolling('pj-picture')
        }
        if (poller.isPolling('pj-anamorphic') && prevProps.anamorphicMode !== this.props.anamorphicMode) {
            poller.stopPolling('pj-anamorphic')
        }
    };

    componentWillUnmount = () => {
        poller.stopAllMatching('pj-');
        this.props.clearPowerState();
    };

    pjIsOn = () => this.props.powerState === 'LampOn';

    hdrIsOn = () => this.props.pictureMode === 'User5';

    anamorphicAIsOn = () => this.props.anamorphicMode === 'A';

    makeRCButton = (key, ci, enabled = this.pjIsOn(), afterSend = k => {}) => {
        return (
            <Button key={key}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => {
                        this.props.sendCommandToPJ(key);
                        afterSend(key);
                    }}
                    className={this.props.classes.rcButton}
                    disabled={key === null || !enabled}>
                {ci}
            </Button>
        );
    };

    makePowerButton = (powerState) => {
        if (!powerState || powerState === "Standby") {
            return this.makeRCButton('Power.PowerState.LampOn', <Power/>, true, this.pollForPowerState);
        } else if (powerState === "LampOn") {
            return this.makeRCButton('Power.PowerState.Standby', <PowerOff/>, true, this.pollForPowerState);
        } else if (powerState === "Starting" || powerState === "Cooling") {
            return this.makeRCButton(null, <CircularProgress size={24}/>);
        } else if (powerState === "Error") {
            return this.makeRCButton(null, <Error/>);
        }
    };

    render() {
        const {classes, powerState} = this.props;
        return (
            <Grid container className={classes.bordered} spacing={1}>
                <Grid container justify={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                    <Grid item>
                        <Grid container direction={'column'} justify={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {this.makePowerButton(powerState)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.Menu', <Menu/>)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.Menu_Advanced', <AdvancedMenu/>)}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container justify={'space-around'} alignItems={'center'} spacing={1}>
                            <Grid item>
                                <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Menu_Info', <Info/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Up', <UpArrow/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.PictureMode_User5', <HdrOn/>, this.pjIsOn() && !this.hdrIsOn(), this.pollForPictureMode)}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Left', <LeftArrow/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.OK', <Check/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Right', <RightArrow/>)}
                                    </Grid>
                                </Grid>
                                <Grid container justify={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Back', <Back/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Down', <DownArrow/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.PictureMode_User4', <HdrOff/>, this.pjIsOn() && this.hdrIsOn(), this.pollForPictureMode)}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={'column'} justify={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {this.makeRCButton('Remote.RemoteCode.InstallationMode1', <TVAspect/>, this.pjIsOn(), this.pollForAnamorphic)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton(['Remote.RemoteCode.InstallationMode2', 'PAUSE3', 'Remote.RemoteCode.Anamorphic_Off'], <ScopeAspect/>, this.pjIsOn(), this.pollForAnamorphic)}
                            </Grid>
                            <Grid item>
                                {this.makeRCButton(['Remote.RemoteCode.InstallationMode2', 'PAUSE3', 'Remote.RemoteCode.Anamorphic_A'], <ScopeStreamAspect/>, this.pjIsOn() && !this.anamorphicAIsOn(), this.pollForAnamorphic)}
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
        anamorphicMode: getAnamorphicMode(state),
        pictureMode: getPictureMode(state),
        powerState: getPowerState(state)
    };
};
export default connect(mapStateToProps, {
    sendCommandToPJ,
    getAnamorphicModeFromPJ,
    getPictureModeFromPJ,
    getPowerStateFromPJ,
    clearPowerState
})(withStyles(styles, {withTheme: true})(RemoteControl));

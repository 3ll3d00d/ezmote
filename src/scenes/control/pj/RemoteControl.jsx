import React, {Component} from 'react';
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import UpArrow from '@mui/icons-material/ArrowUpward';
import Info from '@mui/icons-material/Info';
import Power from '@mui/icons-material/Power';
import PowerOff from '@mui/icons-material/PowerOff';
import DownArrow from '@mui/icons-material/ArrowDownward';
import LeftArrow from '@mui/icons-material/ArrowBack';
import RightArrow from '@mui/icons-material/ArrowForward';
import Check from '@mui/icons-material/Check';
import Menu from '@mui/icons-material/Menu';
import AdvancedMenu from '@mui/icons-material/MoreVert';
import Back from '@mui/icons-material/ChevronLeft';
import HdrOn from '@mui/icons-material/HdrOn';
import HdrOff from '@mui/icons-material/HdrOff';
import ScopeAspect from '@mui/icons-material/Crop75';
import TVAspect from '@mui/icons-material/Crop32';
import ScopeStreamAspect from '@mui/icons-material/PanoramaHorizontal';
import Error from '@mui/icons-material/Error';
import CircularProgress from '@mui/material/CircularProgress';
import withStyles from '@mui/styles/withStyles';
import {connect} from "react-redux";
import {
    clearAnamorphicState,
    clearInstallationModeState,
    clearPictureModeState,
    clearPowerState,
    getAnamorphicModeFromPJ,
    getInstallationModeFromPJ,
    getPictureModeFromPJ,
    getPowerStateFromPJ,
    sendCommandToPJ
} from "../../../store/pj/actions";
import {
    getAnamorphicMode,
    getInstallationMode,
    getLastUpdateMillis,
    getPending,
    getPictureMode,
    getPowerState
} from "../../../store/pj/reducer";
import Immutable from 'seamless-immutable';
import debounce from "lodash.debounce";

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

    findFunc = (val) => {
        if (val === 'powerState') {
            return this.props.getPowerStateFromPJ;
        } else if (val === 'anamorphicMode') {
            return this.props.getAnamorphicModeFromPJ;
        } else if (val === 'installationMode') {
            return this.props.getInstallationModeFromPJ;
        } else if (val === 'pictureMode') {
            return this.props.getPictureModeFromPJ;
        } else {
            return null;
        }
    }

    debouncePJ = (val) => debounce(this.findFunc(val), 500, {leading:false, trailing:true});

    state = {
        expected: Immutable({})
    }

    expectPowerStateChange = () => {
        this.expectChange(true, 'powerState');
    }

    expectPictureModeChange = () => {
        this.expectChange(false,'pictureMode');
    }

    expectChangeTo169 = () => {
        if (this.anamorphicAIsOn()) {
            this.expectChange(false, 'installationMode', 'anamorphicMode');
        } else {
            this.expectChange(false, 'installationMode');
        }
    };

    expectChangeToScope = () => {
        if (this.anamorphicAIsOn()) {
            this.expectChange(false, 'anamorphicMode');
        } else {
            this.expectChange(false, 'installationMode');
        }
    };

    expectChangeToStreamingScope = () => {
        if (this.anamorphicModeIsOn()) {
            this.expectChange(false,'anamorphicMode');
        } else {
            this.expectChange(false,'anamorphicMode', 'installationMode');
        }
    };

    expectChange = (replace, ...chgs) => {
        this.setState((prevState, prevProps) => {
            const {expected} = prevState;
            const newChgs = chgs.filter(c => !expected.hasOwnProperty(c));
            if (newChgs.length > 0) {
                const chgFuncs = Object.assign({}, ...newChgs.map(c => {
                    return {[c]: this.debouncePJ(c)};
                }));
                if (replace) {
                    return {expected: Immutable(chgFuncs)}
                } else {
                    return {expected: Immutable.merge(expected, chgFuncs)}
                }
            } else {
                return prevState;
            }
        });
    }

    componentDidMount = () => {
        this.expectPowerStateChange();
    };

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.powerState !== this.props.powerState) {
            if (this.props.powerState === 'LampOn') {
                this.expectChange(true, 'anamorphicMode', 'pictureMode', 'installationMode');
            } else if (this.props.powerState === 'Standby' || this.props.powerState === 'Error') {
                this.cancelAllExpectations();
            } else if (prevProps.lastUpdateMillis !== this.props.lastUpdateMillis) {
                this.pollPJ();
            }
        } else if (prevProps.anamorphicMode !== this.props.anamorphicMode) {
            this.removeExpectedFromState('anamorphicMode');
        } else if (prevProps.pictureMode !== this.props.pictureMode) {
            this.removeExpectedFromState('pictureMode');
        } else if (prevProps.installationMode !== this.props.installationMode) {
            this.removeExpectedFromState('installationMode');
        } else if (prevProps.lastUpdateMillis !== this.props.lastUpdateMillis || this.hasExpectedChanged(prevState)) {
            this.pollPJ();
        } else {
            console.log('?');
        }
    };

    pollPJ = () => {
        const {expected} = this.state;
        if (expected.hasOwnProperty('powerState')) {
            expected['powerState']();
        } else if (expected.hasOwnProperty('anamorphicMode')) {
            expected['anamorphicMode']();
        } else if (expected.hasOwnProperty('installationMode')) {
            expected['installationMode']();
        } else if (expected.hasOwnProperty('pictureMode')) {
            expected['pictureMode']();
        } else if (Object.keys(expected).length === 0) {
            // all done
        }
    };

    hasExpectedChanged = (prevState) => {
        const {expected} = this.state;
        const {expected: prevExpected} = prevState;
        if (prevExpected) {
            return Object.keys(prevExpected).length !== Object.keys(expected).length
                    || Object.keys(expected).some(e => !prevExpected.hasOwnProperty(e));
        } else {
            return false;
        }
    };

    removeExpectedFromState = (toRemove) => {
        this.setState((prevState, prevProps) => {
            if (prevState.expected.hasOwnProperty(toRemove)) {
                prevState.expected[toRemove].cancel();
                return {expected: Immutable.without(prevState.expected, toRemove)};
            } else {
                return prevState;
            }
        });
    };

    cancelAllExpectations = () => {
        this.setState((prevState, prevProps) => {
            Object.values(prevState.expected).forEach(v => v.cancel());
            return {expected: Immutable({})};
        });
    };

    componentWillUnmount = () => {
        Object.values(this.state.expected).forEach(v => v.cancel());
        this.props.clearPowerState();
        this.props.clearPictureModeState();
        this.props.clearAnamorphicState();
        this.props.clearInstallationModeState();
    };

    pjIsOn = () => this.props.powerState === 'LampOn';

    hdrIsOn = () => this.props.pictureMode === 'User5';

    anamorphicAIsOn = () => this.props.anamorphicMode === 'A';

    anamorphicModeIsOn = () => this.props.installationMode === 'TWO';

    makeRCButton = (key, ci, enabled = this.pjIsOn(), beforeSend = k => {}) => {
        return (
            <Button key={key}
                    variant={'contained'}
                    size={'small'}
                    onClick={() => {
                        beforeSend(key);
                        this.props.sendCommandToPJ(key);
                    }}
                    className={this.props.classes.rcButton}
                    disabled={key === null || !enabled}>
                {ci}
            </Button>
        );
    };

    makePowerButton = (powerState) => {
        if (!powerState || powerState === "Standby") {
            return this.makeRCButton('Power.PowerState.LampOn', <Power/>, true, this.expectPowerStateChange);
        } else if (powerState === "LampOn") {
            return this.makeRCButton('Power.PowerState.Standby', <PowerOff/>, true, this.expectPowerStateChange);
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
                <Grid container justifyContent={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                    <Grid item>
                        <Grid container direction={'column'} justifyContent={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
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
                        <Grid container justifyContent={'space-around'} alignItems={'center'} spacing={1}>
                            <Grid item>
                                <Grid container justifyContent={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Menu_Info', <Info/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Up', <UpArrow/>)}
                                    </Grid>
                                    <Grid item>
                                        {
                                            this.makeRCButton('Remote.RemoteCode.PictureMode_User5',
                                                <HdrOn/>,
                                                this.pjIsOn() && !this.hdrIsOn(),
                                                this.expectPictureModeChange)
                                        }
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent={'space-around'} alignItems={'center'} spacing={1}>
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
                                <Grid container justifyContent={'space-around'} alignItems={'center'} className={classes.smallPadded} spacing={1}>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Back', <Back/>)}
                                    </Grid>
                                    <Grid item>
                                        {this.makeRCButton('Remote.RemoteCode.Down', <DownArrow/>)}
                                    </Grid>
                                    <Grid item>
                                        {
                                            this.makeRCButton('Remote.RemoteCode.PictureMode_User4',
                                                <HdrOff/>,
                                                this.pjIsOn() && this.hdrIsOn(),
                                                this.expectPictureModeChange)
                                        }
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container direction={'column'} justifyContent={'space-evenly'} align-items={'center'} className={classes.smallPadded} spacing={1}>
                            <Grid item>
                                {
                                    this.makeRCButton('Remote.RemoteCode.InstallationMode1',
                                        <TVAspect/>,
                                        this.pjIsOn() && this.anamorphicModeIsOn(),
                                        this.expectChangeTo169)
                                }
                            </Grid>
                            <Grid item>
                                {
                                    this.makeRCButton(
                                        ['Remote.RemoteCode.InstallationMode2', 'PAUSE3', 'Remote.RemoteCode.Anamorphic_Off'],
                                        <ScopeAspect/>,
                                        this.pjIsOn() && ((this.anamorphicModeIsOn() && this.anamorphicAIsOn()) || !this.anamorphicModeIsOn()),
                                        this.expectChangeToScope)
                                }
                            </Grid>
                            <Grid item>
                                {
                                    this.makeRCButton(
                                        ['Remote.RemoteCode.InstallationMode2', 'PAUSE3', 'Remote.RemoteCode.Anamorphic_A'],
                                        <ScopeStreamAspect/>,
                                        this.pjIsOn() && ((this.anamorphicModeIsOn() && !this.anamorphicAIsOn()) || !this.anamorphicModeIsOn()),
                                        this.expectChangeToStreamingScope)
                                }
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
        anamorphicMode: getAnamorphicMode(state),
        pictureMode: getPictureMode(state),
        installationMode: getInstallationMode(state),
        powerState: getPowerState(state),
        pending: getPending(state),
        lastUpdateMillis: getLastUpdateMillis(state)
    };
};
export default connect(mapStateToProps, {
    sendCommandToPJ,
    getAnamorphicModeFromPJ,
    getPictureModeFromPJ,
    getInstallationModeFromPJ,
    getPowerStateFromPJ,
    clearPowerState,
    clearPictureModeState,
    clearInstallationModeState,
    clearAnamorphicState,
})(withStyles(styles, {withTheme: true})(RemoteControl));

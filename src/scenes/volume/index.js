import React, {Component} from 'react';
import _ from "lodash";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Chip from 'material-ui/Chip';
import {FontIcon, Slider} from 'react-md';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/zones/reducer";
import {fetchZones, setVolume, muteVolume, unmuteVolume} from "../../store/zones/actions";
import {getConfig} from "../../store/config/reducer";

class Volume extends Component {

    componentDidMount = () => {
        this.props.dispatch(fetchZones());
    };

    componentWillReceiveProps = (nextProps) => {
        if (this.props.config.valid === false && nextProps.config.valid === true) {
            console.warn("Fetching zones on validate");
            this.props.dispatch(fetchZones());
        }
    };

    setVolume = zoneId => (value, event) => {
        this.props.dispatch(setVolume(zoneId, value / 100));
    };

    slowSetVolume = zoneId => _.debounce(this.setVolume(zoneId), 50);

    muteVolume = zoneId => () => {
        this.props.dispatch(muteVolume(zoneId));
    };

    unmuteVolume = zoneId => () => {
        this.props.dispatch(unmuteVolume(zoneId));
    };

    makeMuteButton = (zoneId) => {
        const {zone} = this.props;
        if (!zone.muted) {
            return <FontIcon onClick={this.muteVolume(zoneId)}>volume_up</FontIcon>;
        } else {
            return <FontIcon onClick={this.unmuteVolume(zoneId)}>volume_off</FontIcon>;
        }
    };

    render() {
        const {zone, dispatch} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio ? Math.round(zone.volumeRatio * 100) : 0;
            return (
                <Paper>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container justify={'space-around'} alignItems={'center'}>
                                <Grid item xs={2}>
                                    <Chip label={zone.name}/>
                                </Grid>
                                <Grid item xs={10}>
                                    <Slider id="volume-slider"
                                            label="Volume"
                                            leftIcon={this.makeMuteButton(zone.id)}
                                            discrete
                                            discreteTicks={5}
                                            onChange={this.slowSetVolume(zone.id)}
                                            value={currentVolume}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            );
        } else {
            return (
                <Paper>
                    <Button raised onClick={() => dispatch(fetchZones())}>Load Zones</Button>
                </Paper>
            );
        }
    };
}

const mapStateToProps = (state) => {
    return {
        zone: getActiveZone(state),
        config: getConfig(state)
    };
};
export default connect(mapStateToProps)(Volume);
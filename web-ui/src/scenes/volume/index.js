import React, {Component} from 'react';
import {Button, Grid, LinearProgress, Paper} from "material-ui";
import Chip from 'material-ui/Chip';
import {connect} from 'react-redux';
import {getActiveZone} from "../../store/zones/reducer";
import {setVolume, fetchZones} from "../../store/zones/actions";

const deltas = [-10, -5, -1, 1, 5, 10];

class Volume extends Component {

    componentDidMount = () => {
        this.props.dispatch(fetchZones());
    };

    applyDelta = (delta, zoneId, currentVolume) => {
        this.props.dispatch(setVolume(zoneId, Math.max(0, Math.min(100, currentVolume + delta))/100));
    };

    getButton = (delta, currentVolume) => {
        return (
            <Grid key={`volume${delta}`} item xs={2}>
                <Button raised onClick={() => this.applyDelta(delta, currentVolume)}>{delta > 0 ? '+' : ''}{delta}</Button>
            </Grid>
        );
    };

    render() {
        const {zone, dispatch} = this.props;
        if (zone) {
            const currentVolume = zone.volumeRatio * 100;
            return (
                <Paper>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container>
                                {
                                    deltas.map(d => this.getButton(d, zone.id, currentVolume))
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container justify={'space-around'} alignItems={'center'}>
                                <Grid item xs={2}>
                                    <Chip label={zone.name}/>
                                </Grid>
                                <Grid item xs={10}>
                                    <LinearProgress mode="determinate"
                                                    value={currentVolume}
                                                    min={0}
                                                    max={100}/>
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
    return {zone: getActiveZone(state)};
};
export default connect(mapStateToProps)(Volume);
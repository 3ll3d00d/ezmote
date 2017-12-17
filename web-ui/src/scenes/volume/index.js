import React, {Component} from 'react';
import {Button, Grid, LinearProgress, Paper} from "material-ui";
import Chip from 'material-ui/Chip';

const deltas = [-10, -5, -1, 1, 5, 10];

export default class Volume extends Component {

    state = {
        value: 40,
        zone: 'TV'
    };

    applyDelta = (delta) => {
        this.setState((prevState, prevProps) => {
            return {value: Math.max(0, Math.min(100, prevState.value + delta))};
        });
    };

    getButton = (delta) => {
        return (
            <Grid key={`volume${delta}`} item xs={2}>
                <Button raised onClick={() => this.applyDelta(delta)}>{delta > 0 ? '+' : ''}{delta}</Button>
            </Grid>
        );
    };

    render() {
        return (
            <Paper>
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container>
                            {
                                deltas.map(d => this.getButton(d))
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container justify={'space-around'} alignItems={'center'}>
                            <Grid item xs={2}>
                                <Chip label={this.state.zone}/>
                            </Grid>
                            <Grid item xs={10}>
                                <LinearProgress mode="determinate"
                                                value={this.state.value}
                                                min={0}
                                                max={100}/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        )
    };
}
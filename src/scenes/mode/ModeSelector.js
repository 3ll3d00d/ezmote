import React from 'react';
import Grid from "material-ui/Grid";
import Row from "./Row";
import {withStyles} from 'material-ui/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    }
});

const ModeSelector = ({classes, commands, sendCommand}) => {
    const chunks = [];
    const commandArray = Object.keys(commands).map(k => commands[k]);
    for (let i = 0; i < commandArray.length; i += 2) {
        chunks.push(commandArray.slice(i, Math.min(i + 2, commandArray.length)));
    }
    return (
        <div className={classes.root}>
            <Grid container>
                {chunks.map((chunk, idx) => (
                    <Grid key={`modeRow${idx}`} container justify='space-around' spacing={40}>
                        <Grid xs item>
                            <Row items={chunk} sendCommand={sendCommand}/>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

ModeSelector.propTypes = {
    commands: PropTypes.object.isRequired,
    sendCommand: PropTypes.func.isRequired
};

export default withStyles(styles)(ModeSelector);
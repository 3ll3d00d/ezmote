import React from 'react';
import Grid from "material-ui/Grid";
import PropTypes from 'prop-types';
import ModeCard from "./ModeCard";

const Row = ({items, sendCommand}) => {
    return (
        <Grid container justify='space-around'>
            {
                items.map(i => {
                    return (
                        <Grid item xs key={i.id}>
                            <ModeCard name={i.id} img={i.icon} sendCommand={sendCommand}/>
                        </Grid>
                    );
                })
            }
        </Grid>
    );
};

Row.propTypes = {
    items: PropTypes.array.isRequired,
    sendCommand: PropTypes.func.isRequired
};

export default Row;
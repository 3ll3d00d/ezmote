import React from 'react';
import {Grid} from "material-ui";
import PropTypes from 'prop-types';
import ModeCard from "./ModeCard";

const Row = ({items}) => {
    return (
        <Grid container justify='space-around'>
            {
                items.map(i => {
                    return (
                        <Grid item xs key={i.name}>
                            <ModeCard key={i.name} name={i.name} img={i.img} active={i.active}/>
                        </Grid>
                    );
                })
            }
        </Grid>
    );
};

Row.propTypes = {
    items: PropTypes.array.isRequired,
};

export default Row;
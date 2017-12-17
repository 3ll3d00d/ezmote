import React from 'react';
import all4 from './img/all4.png';
import amazon from './img/amazon.png';
import iplayer from './img/iplayer.png';
import itv from './img/itv.png';
import netflix from './img/netflix.png';
import virgin from './img/virgin.png';
import music from './img/music.png';
import films from './img/films.png';
import {Grid} from "material-ui";
import Row from "./Row";
import {withStyles} from 'material-ui/styles';

const row1 = {
    'music': music,
    'films': films,
    'netflix': netflix,
    'virgin': virgin,
};
const row2 = {
    'iplayer': iplayer,
    'all4': all4,
    'amazon': amazon,
    'itv': itv,
};

const active = 'music';

const convert = (row) => {
    return Object.keys(row).map(i => {
        return {
            name: i,
            img: row[i],
            active: i === active
        };
    });
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 30,
    }
});

const Mode = ({classes}) => {
    return (
        <div className={classes.root}>
            <Grid container>
                <Grid container justify='space-around' spacing={40}>
                    <Grid xs item>
                        <Row items={convert(row1)}/>
                    </Grid>
                </Grid>
                <Grid container justify='space-around' spacing={40}>
                    <Grid xs item>
                        <Row items={convert(row2)}/>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default withStyles(styles)(Mode);

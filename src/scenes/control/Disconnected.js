import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Error from '@material-ui/icons/Error';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    icon: {
        margin: theme.spacing(1),
        height: '6em',
        width: '6em'
    },
});

const Disconnected = ({classes}) => {
    return (
        <Grid container>
            <Grid container alignItems={'center'} justify={'center'}>
                <Grid item>
                    <Error className={classes.icon} color={'error'}/>
                </Grid>
            </Grid>
            <Grid container alignItems={'center'} justify={'center'}>
                <Grid item xs>
                    <Typography color={'secondary'} type={'display1'}>
                        Unable to connect to Media Server
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );
};

Disconnected.propTypes = {
    server: PropTypes.string
};

export default withStyles(styles, {withTheme: true})(Disconnected);
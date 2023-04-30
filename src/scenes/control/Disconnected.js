import React from 'react';
import withStyles from '@mui/styles/withStyles';
import PropTypes from 'prop-types';
import Typography from "@mui/material/Typography";
import Error from '@mui/icons-material/Error';
import Grid from '@mui/material/Grid';
import {connect} from "react-redux";
import {wake} from "../../store/commands/actions";
import Button from "@mui/material/Button";

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

const Disconnected = ({classes, wake}) => {
    return (
        <Grid container>
            <Grid container alignItems={'center'} justifyContent={'center'}>
                <Grid item>
                    <Error className={classes.icon} color={'error'}/>
                </Grid>
            </Grid>
            <Grid container alignItems={'center'} justifyContent={'center'}>
                <Grid item xs>
                    <Typography color={'secondary'} type={'display1'}>
                        Media Server is down
                    </Typography>
                </Grid>
                <Grid item xs>
                    <Button variant={'contained'}
                            color={'primary'}
                            onClick={wake}>
                        Wake?
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    );
};

Disconnected.propTypes = {
    server: PropTypes.string
};

const styledDisconnect = withStyles(styles, {withTheme: true})(Disconnected);
export default connect(null, {wake})(styledDisconnect);
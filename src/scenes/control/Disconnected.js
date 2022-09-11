import React from 'react';
import {withStyles} from "@material-ui/core/styles/index";
import PropTypes from 'prop-types';
import Typography from "@material-ui/core/Typography";
import Error from '@material-ui/icons/Error';
import Grid from '@material-ui/core/Grid';
import {connect} from "react-redux";
import {wake} from "../../store/commands/actions";
import Button from "@material-ui/core/Button";

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
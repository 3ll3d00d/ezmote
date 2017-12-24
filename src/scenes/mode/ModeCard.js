import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardMedia} from 'material-ui/Card';

const styles = {
    card: {
        maxWidth: 150,
    },
    media: {
        height: 150,
    },
};

function ModeCard({classes, name, img, sendCommand}) {
    return (
        <Card elevation={10} className={classes.card}>
            <CardMedia className={classes.media}
                       image={img}
                       title={name}
                       onClick={() => sendCommand(name)}/>
        </Card>
    );
}

ModeCard.propTypes = {
    name: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    sendCommand: PropTypes.func.isRequired
};

export default withStyles(styles)(ModeCard);
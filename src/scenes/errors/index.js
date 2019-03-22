import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';

const hasErrors = errors => errors && Object.keys(errors).length > 0;

const Error = ({errors}) => {
    if (hasErrors(errors)) {
        const mostRecentErrorTime = Object.keys(errors).map(Number).reduce((a, b) => Math.max(a, b));
        if (mostRecentErrorTime) {
            const error = errors[mostRecentErrorTime];
            return (
                <span
                    id="message-id">{error.error} in {error.type} at {new Date(mostRecentErrorTime).toLocaleTimeString()}
                </span>
            );
        }
    }
    return <span id="message-id"/>;
};


const Errors = ({errors}) => {
    return (
        <Snackbar
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            open={hasErrors(errors)}
            SnackbarContentProps={{
                'aria-describedby': 'message-id',
            }}
            message={<Error errors={errors}/>}
        />
    );
};

Errors.propTypes = {
    errors: PropTypes.object
};

export default Errors;

import React from 'react';
import PropTypes from 'prop-types';

const Info = ({activeZone}) => {
    if (activeZone) {
        return (
            <div style={{padding: '1em'}}>
                {activeZone.name}
            </div>
        );
    } else {
        return null;
    }
};

Info.propTypes = {
    activeZone: PropTypes.object
};

export default Info;

import React from 'react';
import PropTypes from 'prop-types';

const Info = ({activeZone}) => {
    return (
        <div style={{padding: '1em'}}>
            {activeZone ? activeZone.name : null}
        </div>
    );
};

Info.propTypes = {
    activeZone: PropTypes.object
};

export default Info;

import React from 'react';
import PropTypes from 'prop-types';
import Volume from "./Volume";
import JRiver from "./jriver";
import {getActiveZone} from "../../store/jriver/reducer";
import {connect} from "react-redux";

const Control = ({activeZone, selectedCommand}) => {
    return (
        <div>
            <Volume/>
            {activeZone && selectedCommand && selectedCommand.nodeId ? <JRiver/> : null}
        </div>
    );
};

Control.propTypes = {
    selectedCommand: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {
        activeZone: getActiveZone(state)
    };
};
export default connect(mapStateToProps)(Control)

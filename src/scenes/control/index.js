import React from 'react';
import PropTypes from 'prop-types';
import Volume from "./Volume";
import JRiver from "./jriver";
import Tivo from "./tivo";
import {getActiveZone} from "../../store/jriver/reducer";
import {connect} from "react-redux";

const Control = ({activeZone, selectedCommand}) => {
    let Controller = null;
    if (activeZone && selectedCommand && selectedCommand.hasOwnProperty('control')) {
        switch (selectedCommand.control) {
            case 'tivo':
                Controller = Tivo;
                break;
            case 'jriver':
                Controller = JRiver;
                break;
            default:
                Controller = null;
        }
    }
    return (
        <div>
            <Volume/>
            {Controller ? <Controller/> : null}
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

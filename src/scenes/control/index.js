import React from 'react';
import PropTypes from 'prop-types';
import Volume from "./Volume";
import JRiver from "./jriver";
import Tivo from "./tivo";
import Info from "./Info";
import {getActiveZone} from "../../store/jriver/reducer";
import {getConfig} from "../../store/config/reducer";
import {connect} from "react-redux";
import {MC_HOST} from "../../store/config/config";
import Disconnected from "./Disconnected";

const Control = ({jriverIsDead, config, activeZone, selectedCommand}) => {
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
    if (jriverIsDead) {
        return <Disconnected server={`jriver at ${config[MC_HOST]}`}/>;
    } else {
        return (
            <div>
                <Volume/>
                {Controller ? <Controller/> : null}
                <Info activeZone={activeZone}/>
            </div>
        );
    }
};

Control.propTypes = {
    selectedCommand: PropTypes.object.isRequired,
    jriverIsDead: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        activeZone: getActiveZone(state),
        config: getConfig(state)
    };
};
export default connect(mapStateToProps)(Control)

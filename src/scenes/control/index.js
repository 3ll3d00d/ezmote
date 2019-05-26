import React from 'react';
import PropTypes from 'prop-types';
import Volume from "./Volume";
import JRiver from "./jriver";
import Tivo from "./tivo";
import {getActiveZone} from "../../store/jriver/reducer";
import {getConfig} from "../../store/config/reducer";
import {connect} from "react-redux";
import {MC_HOST} from "../../store/config/config";
import Disconnected from "./Disconnected";

const Control = ({jriverIsDead, config, activeZone, playingNowCommand, selectedCommand}) => {
    let Controller = null;
    if (activeZone && playingNowCommand && playingNowCommand.hasOwnProperty('control')) {
        switch (playingNowCommand.control) {
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
    if (selectedCommand && selectedCommand.hasOwnProperty('control') && selectedCommand.control === 'jriver') {
        Controller = JRiver;
    }
    if (jriverIsDead) {
        return <Disconnected server={`jriver at ${config[MC_HOST]}`}/>;
    } else {
        return (
            <div>
                <Volume/>
                {Controller ? <Controller selectedCommand={selectedCommand}/> : null}
            </div>
        );
    }
};

Control.propTypes = {
    playingNowCommand: PropTypes.object.isRequired,
    selectedCommand: PropTypes.object,
    jriverIsDead: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        activeZone: getActiveZone(state),
        config: getConfig(state)
    };
};
export default connect(mapStateToProps)(Control)

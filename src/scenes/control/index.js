import React from 'react';
import PropTypes from 'prop-types';
import Volume from "./Volume";
import JRiver from "./jriver";
import Tivo from "./tivo";
import {getActiveZone} from "../../store/jriver/reducer";
import {connect} from "react-redux";
import Disconnected from "./Disconnected";

const Control = ({jriverIsDead, activeZone, playingNowCommand, selectedCommand}) => {
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
        return <Disconnected/>;
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
    playingNowCommand: PropTypes.object,
    selectedCommand: PropTypes.object,
    jriverIsDead: PropTypes.bool
};

const mapStateToProps = (state) => {
    return {
        activeZone: getActiveZone(state)
    };
};
export default connect(mapStateToProps)(Control)

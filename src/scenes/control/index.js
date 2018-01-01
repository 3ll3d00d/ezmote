import React from 'react';
import Volume from "./Volume";
import PlayingNow from "./PlayingNow";
import {getActiveZone} from "../../store/jriver/reducer";
import {connect} from "react-redux";

const Control = ({activeZone}) => {
    return (
        <div>
            <Volume/>
            { activeZone ? <PlayingNow/> : null }
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        activeZone: getActiveZone(state)
    };
};
export default connect(mapStateToProps)(Control)

import React, {Component} from 'react';
import {connect} from "react-redux";
import {getConfig} from "../../store/config/reducer";
import {getCommands} from "../../store/commands/reducer";
import {fetchCommands, sendCommand} from "../../store/commands/actions";
import ModeSelector from "./ModeSelector";
import NoModesAvailable from "./NoModesAvailable";
import {CMDSERVER_PORT} from "../../store/config/config";

class Mode extends Component {
    componentDidMount = () => {
        if (this.props.config.valid && this.props.config[CMDSERVER_PORT]) {
            this.props.dispatch(fetchCommands());
        }
    };

    // componentWillReceiveProps = (nextProps) => {
    //     if (this.props.config.valid === false && nextProps.config.valid === true) {
    //         console.warn("Fetching zones on validate");
    //         this.props.dispatch(fetchZones());
    //     }
    // };

    sendCommand = (commandId) => {
        this.props.dispatch(sendCommand(commandId));
    };

    render() {
        const {commands} = this.props;
        if (Object.keys(commands).length > 0) {
            return <ModeSelector commands={commands} sendCommand={this.sendCommand}/>
        } else {
            return <NoModesAvailable/>
        }
    }
}

const mapStateToProps = (state) => {
    return {
        commands: getCommands(state),
        config: getConfig(state)
    };
};

export default connect(mapStateToProps)(Mode);
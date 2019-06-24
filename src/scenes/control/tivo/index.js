import React, {Component} from 'react';
import RemoteControl from "./RemoteControl";
import {getConfig} from "../../../store/config/reducer";
import {getTivoInfo} from "../../../store/tivos/actions";
import {connect} from "react-redux";

class Tivo extends Component {

    componentDidMount = () => {
        if (this.props.config.valid) {
            this.props.getTivoInfo();
        }
    };

    render() {
        return <RemoteControl />;
    }
}

const mapStateToProps = (state) => {
    return {
        config: getConfig(state)
    };
};
export default connect(mapStateToProps, {getTivoInfo})(Tivo);

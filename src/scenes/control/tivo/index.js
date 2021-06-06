import React, {Component} from 'react';
import RemoteControl from "./RemoteControl";
import {getTivoName} from "../../../store/config/reducer";
import {getTivoInfo} from "../../../store/tivos/actions";
import {connect} from "react-redux";

class Tivo extends Component {

    componentDidMount = () => {
        if (this.props.tivoName) {
            this.props.getTivoInfo();
        }
    };

    render() {
        return <RemoteControl />;
    }
}

const mapStateToProps = (state) => {
    return {
        tivoName: getTivoName(state)
    };
};
export default connect(mapStateToProps, {getTivoInfo})(Tivo);

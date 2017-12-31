import React, {Component} from 'react';
import Volume from "./Volume";
import PlayingNow from "./PlayingNow";

export default class Control extends Component {
    render() {
        return (
            <div>
                <Volume/>
                <PlayingNow/>
            </div>
        );
    }
}
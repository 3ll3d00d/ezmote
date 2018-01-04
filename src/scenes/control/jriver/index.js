import React, {Component} from 'react';
import Tabs, {Tab} from 'material-ui/Tabs';
import PlayingNow from "./PlayingNow";
import RemoteControl from "./RemoteControl";

export default class JRiver extends Component {
    state = {
        value: 0
    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        return (
            <div>
                <Tabs fullWidth
                      indicatorColor="accent"
                      textColor="accent"
                      value={this.state.value}
                      onChange={this.handleChange}>
                    <Tab label="Playing Now"/>
                    <Tab label="Remote Control"/>
                </Tabs>
                {this.state.value === 0 && <PlayingNow/>}
                {this.state.value === 1 && <RemoteControl/>}
            </div>
        );
    }
};
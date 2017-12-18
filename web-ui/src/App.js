import React, {Component} from 'react';

import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import Config from "./scenes/config";
import Volume from "./scenes/volume";
import Mode from "./scenes/mode";
import {Grid} from "material-ui";

const theme = createMuiTheme({
    palette: {
        type: 'light',
    },
});

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Grid container>
                    <Grid item xs={12}>
                        <Config/>
                    </Grid>
                    <Grid item xs={12}>
                        <Volume/>
                    </Grid>
                    <Grid item xs={12}>
                        <Mode/>
                    </Grid>
                </Grid>
            </MuiThemeProvider>
        );
    }
}

export default App;

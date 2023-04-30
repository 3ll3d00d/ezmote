import TextField from '@mui/material/TextField';
import React from "react";
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: '0px'
    }
}));

const Search = ({text, onChange}) => {
    const classes = useStyles();
    return (
        <TextField id="search-text"
                   label="Search"
                   className={classes.container}
                   value={text}
                   onChange={onChange}
                   variant='outlined'
                   margin="normal" />
    );
};

export default Search;
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Typography from "@mui/material/Typography";
import React from "react";
import {default as MdBreadcrumbs} from "@mui/material/Breadcrumbs";
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        marginTop: '8px'
    }
}));

const CmdLink = ({cmd, onSelect}) => {
    return (
        <Link
            key={cmd.nodeId}
            color="inherit"
            onClick={() => onSelect(cmd.nodeId, true)}
            underline="hover">
            {cmd.title}
        </Link>
    );
};

const PathLink = ({path, names, onSelect}) => {
    return (
        <Link
            key={path}
            color="inherit"
            onClick={() => onSelect(path)}
            underline="hover">
            {shortName(names.get(path))}
        </Link>
    );
};

const shortName = name => {
    return name.length > 12 ? `${name.slice(0,12)}...` : name;
};

const Breadcrumbs = ({selectedCommand, path, names, onSelect}) => {
    const classes = useStyles();
    return (
        <MdBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="Breadcrumb" className={classes.container}>
            <CmdLink cmd={selectedCommand} onSelect={onSelect}/>
            {path ? path.slice(0, path.length - 1).map(p => <PathLink key={p} path={p} names={names} onSelect={onSelect} />) : null}
            <Typography color="textPrimary">{shortName(names.get(path[path.length - 1]))}</Typography>
        </MdBreadcrumbs>
    );
};

export default Breadcrumbs;
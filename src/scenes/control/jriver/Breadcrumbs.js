import Link from "@material-ui/core/Link";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {default as MdBreadcrumbs} from "@material-ui/core/Breadcrumbs";
import {makeStyles} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        marginTop: '8px'
    }
}));

const CmdLink = ({cmd, onSelect}) => {
    return (
        <Link key={cmd.nodeId}
              color="inherit"
              onClick={() => onSelect(cmd.nodeId, true)}>
            {cmd.title}
        </Link>
    );
};

const PathLink = ({path, names, onSelect}) => {
    return (
        <Link key={path} color="inherit" onClick={() => onSelect(path)}>
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
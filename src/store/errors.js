import Immutable from "seamless-immutable";

export const makeError = (payload, type) => {
    return Immutable({
        error: payload.message,
        type
    });
};
export const makeKeyedError = ({payload, type}) => {
    return Immutable({
        [new Date().getTime()]: makeError(payload, type)
    });
};
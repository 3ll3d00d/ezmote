import * as types from "./actionTypes"

/**
 * Updates the specified value.
 * @param field the field.
 * @param value the value.
 */
const updateValue = (field, value) => {
    return ({type: types.CONFIG_VALUE_UPDATE, payload: {field, value}});
};

export {updateValue};
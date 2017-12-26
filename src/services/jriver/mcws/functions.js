const safeGetNumber = (item) => {
    const text = safeGetText(item);
    return text ? Number(text) : null;
};

const safeGetText = (item) => {
    return item ? item._text : null;
};

const findItemByName = (name) => (item) => item._attributes.Name === name;

export {
    safeGetNumber,
    safeGetText,
    findItemByName
}
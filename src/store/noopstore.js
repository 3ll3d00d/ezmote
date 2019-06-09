const noop = () => {};
const noopStorage = {
    getItem: noop,
    setItem: noop,
    removeItem: noop,
};

export default noopStorage;
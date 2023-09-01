import configs from '../utils/configs.json';

const parseConfigs = (configKey) => {
    const config = configs[configKey];
    let object = [];
    for (let key in config) {
        let value = config[key];
        object.push({ text: value, value: key, label: value });
    }
    return object;
}

const getConfig = (configKey) => {
    return configs[configKey];
}

export {
    parseConfigs,
    getConfig
}
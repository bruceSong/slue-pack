const xtend = require('xtend');
const slueModule = require('slue-module');
const utils = require('./utils');

module.exports = function(config, modulesMap) {
    let filesMap = {
        groupMap: {},
        originMap: {}
    };

    for (let key in config.entry) {
        let slueModConfig = xtend({
            filePath: config.entry[key]
        }, config);

        let relayData = slueModule(slueModConfig);

        if (relayData) {
            modulesMap = Object.assign(modulesMap, relayData.modulesMap)
            filesMap.groupMap[key] = utils.groupByPlugins(relayData, config);
            filesMap.originMap[key] = relayData;
        }
    }

    return filesMap;
}
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const xtend = require('xtend');
const slueFs = require('slue-fs');
const getConfig = require('./config');
const utils = require('./lib/utils');
const getFilesMap = require('./lib/getFilesMap');
const getStream = require('./lib/getStream');
const savePacks = require('./lib/savePacks');
const Main = require('./lib/main');

let config = {};
let modulesMap = {};
let groupMap;

module.exports = function(config) {
    config = getConfig(config);

    utils.clearCache();

    let {
        groupMap,
        originMap
    } = getFilesMap(config, modulesMap);

    //console.log(originMap.app.handledFile);
    
    getStream(groupMap, modulesMap).then(function(data) {
        let mainInstance = new Main(data);
        mainInstance.on('ok', function(data) {
            savePacks(config, originMap);
        });
    });

    if (config.watch === true) {
        let allFile = [];
        for (let appKey in originMap) {
            allFile = allFile.concat(Object.keys(originMap[appKey].handledFile));
        }

        let watcher = slueFs.watch(allFile);
        watcher.on('change', function(filePath, stat) {
            if (!utils.isCssFile(path.extname(filePath))) {
                let _config = xtend({}, config);
                _config.entry = {
                    watcherFile: filePath
                };
                let data = getFilesMap(_config, modulesMap);
                let _groupMap = data.groupMap;
                let _originMap = data.originMap;

                for (let appKey in originMap) {
                    let _handledFile = _originMap.watcherFile.handledFile;
                    for (let _filePath in _handledFile) {
                        if (originMap[appKey].handledFile[_filePath]) {
                            originMap[appKey].handledFile[_filePath] = _handledFile[_filePath];
                        }
                    }
                }

                getStream(_groupMap, modulesMap).then(function(data) {
                    let mainInstance = new Main(data);
                    mainInstance.on('ok', function(data) {
                        savePacks(config, originMap);
                    });
                });
            }
        });
    }
};
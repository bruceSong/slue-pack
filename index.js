const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const xtend = require('xtend');
const slueFs = require('slue-fs');
const getConfig = require('./config');
const utils = require('./lib/utils');
const getFilesMap = require('./lib/getFilesMap');
const getStream = require('./lib/getStream');
const saveJsPack = require('./lib/saveJsPack');
const main = require('./lib/main');

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

    getStream(groupMap, modulesMap).then(function(stream) {
        return main(stream, modulesMap, config);
    }).then(function(data) {
        fse.mkdirsSync(`${config.output}/js`);
        fse.mkdirsSync(`${config.output}/css`);

        let jsPackSrc = saveJsPack(data.jsPackMap, config);

        if (data.cssFileList.length) {
            let cssPackSrc = `${config.output}/css/app.css`;
            fs.writeFileSync(cssPackSrc, data.cssFileList.join(''));
            jsPackSrc.push(cssPackSrc);
        }

        fse.copySync(utils.imgCacheDir, `${config.output}/images`);
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

                getStream(_groupMap, modulesMap).then(function(stream) {
                    return main(stream, modulesMap, _config);
                }).then(function(data) {
                    console.log(data);
                });
            }
        });
    }
};
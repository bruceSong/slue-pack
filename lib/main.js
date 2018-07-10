const path = require('path');
const slueStream = require('slue-stream');
const utils = require('./utils');
const moduleReplacer = require('./replacer');
const moduleWrap = require('./wrap');

module.exports = function(stream, modulesMap, config) {
    let promise = new Promise(function(resolve, reject) {
        let handledFilesNum = 0;
        let jsPackMap = {};
        let cssFileList = [];
        stream.pipe(moduleReplacer)
            .pipe(moduleWrap)
            .pipe(slueStream.transformObj(function(file, env, cb) {
                let extname = path.extname(file.path);

                if (utils.isCssFile(extname)) {
                    cssFileList.push(file.contents.toString());
                } else {
                    jsPackMap[file.entryName] = jsPackMap[file.entryName] || [];
                    jsPackMap[file.entryName].push(file.contents.toString());
                }

                handledFilesNum++;
                if (handledFilesNum >= Object.keys(modulesMap).length - Object.keys(config.externals).length) {
                    resolve({
                        jsPackMap,
                        cssFileList
                    });
                }

                cb(null, file);
            }));
    });

    return promise;
}
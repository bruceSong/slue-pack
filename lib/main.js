const path = require('path');
const slueStream = require('slue-stream');
const Events = require('events');
const util = require('util');
const slueUtils = require('./utils');
const moduleReplacer = require('./replacer');
const moduleWrap = require('./wrap');

function Main(opts) {
    let self = this;
    Events.call(self);

    let handledFilesNum = 0;
    let jsPackMap = {};
    let cssFileList = [];
    opts.stream.pipe(moduleReplacer())
        .pipe(moduleWrap())
        .pipe(slueStream.transformObj(function(file, env, cb) {
            let extname = path.extname(file.path);

            if (slueUtils.isCssFile(extname)) {
                cssFileList.push(file.contents.toString());
            } else {
                jsPackMap[file.entryName] = jsPackMap[file.entryName] || [];
                jsPackMap[file.entryName].push(file.contents.toString());
            }

            handledFilesNum++;
            if (handledFilesNum >= opts.filesNumber) {
                self.emit('ok', {
                    jsPackMap,
                    cssFileList
                });
            }

            cb(null, file);
        }));
}
util.inherits(Main, Events);

module.exports = Main
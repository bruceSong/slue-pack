const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const slueStream = require('slue-stream');
const utils = require('./utils');

module.exports = function() {
    return slueStream.transformObj(function(file, env, cb) {
        let extname = path.extname(file.path);
        let item = file.contents.toString();
        if (extname !== '.css' && extname !== '.less' && extname !== '.sass') {
            let moduleId = file.path == file.modulesMap.entry_file_module ? 'entry_file_module' : file.path;
            item = `'${moduleId}': function(require, exports, module) {\n ${file.contents.toString()} \n}`;
        }
    
        fs.writeFileSync(`${utils.cacheDir}/tpls/${md5(file.path)}.tpl`, item);
    
        file.contents = new Buffer.from(item);
    
        cb(null, file);
    });
};
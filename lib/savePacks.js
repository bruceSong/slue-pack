const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const md5 = require('md5');
const beautify = require('js-beautify');
const utils = require('./utils');

module.exports = function(config, originMap) {
    fse.mkdirsSync(`${config.output}/js`);
    fse.mkdirsSync(`${config.output}/css`);

    let packTpl = fs.readFileSync(`${utils.libDir}/template.tpl`, 'utf8');

    for (let appKey in config.entry) {
        let entryFilePath = path.resolve(process.cwd(), config.entry[appKey]);
        let entryFileRelayFilesPath = originMap[appKey].handledFile[entryFilePath];
        if (entryFileRelayFilesPath instanceof Array) {
            let packJsSrc = [];
            let packCssSrc = [];
            entryFileRelayFilesPath.forEach(function(filePath) {
                let extname = path.extname(filePath);
                let contents = fs.readFileSync(`${utils.tplCacheDir}/${md5(filePath)}.tpl`, 'utf8');
                if (utils.isCssFile(extname)) {
                    let contents = fs.readFileSync(`${utils.tplCacheDir}/${md5(filePath)}.tpl`, 'utf8');
                    packCssSrc.push(contents);
                } else {
                    packJsSrc.push(contents);
                }
            });

            packTpl = packTpl.replace('{{slue-pack-modules-map}}', packJsSrc.join(',\n\r'));
            packTpl = beautify(packTpl, {
                indent_size: 4
            });

            let packPath = `${config.output}/js/${appKey}.js`;
            fs.writeFileSync(packPath, packTpl);

            if (packCssSrc.length) {
                let packPath = `${config.output}/css/${appKey}.css`;
                fs.writeFileSync(packPath, packCssSrc.join('\n\r'));
            }

            fse.copySync(utils.imgCacheDir, `${config.output}/images`);
        }
    }
}
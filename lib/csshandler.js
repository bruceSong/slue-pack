const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const md5 = require('md5');
const utils = require('./utils');

module.exports = function(file) {
    let extname = path.extname(file.path);
    if (extname === '.css' || extname === '.less' || 'extname' === '.sass') {
        let regular = /url\('?"?[\w-\/\.]+\.\w+'?"?\)/g;
        let itemRegular = /url\('?"?([\w-\/\.]+\.\w+)'?"?\)/;
        let contents = file.contents.toString();
        contents = contents.replace(regular, function(item) {
            let itemMatchRes = item.match(itemRegular);
            if (itemMatchRes) {
                if (itemMatchRes.indexOf('data:image') == -1) {
                    let theImgPath = path.resolve(path.dirname(file.path), itemMatchRes[1]);
                    let theImgPathParser = path.parse(theImgPath);
                    if (fs.existsSync(theImgPath)) {
                        let hash = md5(theImgPath).slice(0, 8);
                        let hashName = `${theImgPathParser.name}-${hash}${theImgPathParser.ext}`;
                        fse.copySync(theImgPath, `${utils.imgCacheDir}/${hashName}`);
                        item = item.replace(itemMatchRes[1], `../images/${hashName}`);
                    }
                }

                return item;
            }
            return item;
        });

        file.contents = new Buffer.from(contents);
    }
    return file;
}
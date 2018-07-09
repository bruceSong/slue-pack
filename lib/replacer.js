const path = require('path');
const slueStream = require('slue-stream');

module.exports = slueStream.transformObj(function(file, env, cb) {
    let moduleRegular = /(require\((\'|\")[\w\.\/-]+(\'|\")\);?)|(import\s+\w+\s+from\s+(\'|\")[\w\.\/-]+(\'|\");?)|(import\s+(\'|\")[\w\.\/-]+(\'|\");?)/g;
    let itemRegular = /(?:require\((?:\'|\")([\w\.\/-]+)(?:\'|\")\))|(?:import\s+\w+\s+from\s+(?:\'|\")([\w\.\/-]+)(?:\'|\"))|(?:import\s+(?:\'|\")([\w\.\/-]+)(?:\'|\"))/;

    let contents = file.contents.toString();
    contents = contents.replace(moduleRegular, function(item) {
        let itemMatchRes = item.match(itemRegular);
        if (itemMatchRes) {
            let moduleId = itemMatchRes[1] || itemMatchRes[2] || itemMatchRes[3];
            let filePath = file.modulesMap[moduleId];
            if (filePath) {
                let extname = path.extname(filePath);
                if (extname === '.css' || extname === '.less' || extname === '.sass') {
                    item = '';
                } else {
                    item = item.replace(new RegExp(moduleId), file.modulesMap[moduleId]);
                }
            }
        }
        return item;
    });

    file.contents = new Buffer(contents);

    cb(null, file);
});
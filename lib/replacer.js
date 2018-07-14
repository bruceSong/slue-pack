const path = require('path');
const slueStream = require('slue-stream');

module.exports = function() {
    return slueStream.transformObj(function(file, env, cb) {
        let moduleRegular = /require\((\'|\")[\w\.\/-]+(?:\1)\)|import\s+(?:(?:\w+)|(?:\{(?:\s*\r*\n*\w+\s*,*)+\}))?(?:\s+from\s+)?(\'|\")[\w\.\/-]+(?:\2)/g;
        let itemRegular = /require\((\'|\")([\w\.\/-]+)(?:\1)\)|import\s+(?:(?:\w+)|(?:\{(?:\s*\r*\n*\w+\s*,*)+\}))?(?:\s+from\s+)?(\'|\")([\w\.\/-]+)(?:\3)/;
    
        let contents = file.contents.toString();
        contents = contents.replace(moduleRegular, function(item) {
            let itemMatchRes = item.match(itemRegular);
            if (itemMatchRes) {
                let moduleId = itemMatchRes[2] || itemMatchRes[4];
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
    
        file.contents = new Buffer.from(contents);
    
        cb(null, file);
    });
}
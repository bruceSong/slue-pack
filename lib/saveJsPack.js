const fs = require('fs');
const beautify = require('js-beautify');
const utils = require('./utils');

module.exports = function(jsPackMap, config) {
    let packsSrc = [];
    let packTpl = fs.readFileSync(`${utils.libDir}/template.tpl`);
    for (var appkey in jsPackMap) {
        let packPath = `${config.output}/js/${appkey}.js`;
        packTpl = packTpl.toString();
        packTpl = packTpl.replace('{{slue-pack-modules-map}}', jsPackMap[appkey].join(',\n\r'));
        packTpl = beautify(packTpl, {
            indent_size: 4
        });
        fs.writeFileSync(packPath, packTpl);
        packsSrc.push(packPath);
    }
    return packsSrc;
}
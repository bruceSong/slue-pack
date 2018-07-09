const fse = require('fs-extra');
const path = require('path');

module.exports = {
    cacheDir: path.resolve(__dirname, '../cache'),
    imgCacheDir: path.resolve(__dirname, '../cache/images'),
    tplCacheDir: path.resolve(__dirname, '../cache/tpls'),
    libDir: path.resolve(__dirname),
    clearCache: function() {
        fse.emptyDirSync(this.cacheDir);
        fse.mkdirsSync(this.tplCacheDir);
        fse.mkdirsSync(this.imgCacheDir);
    },
    isCssFile: function(extname) {
        return extname === '.css' || extname === '.less' || extname === 'sass';
    },
    groupByPlugins: function(relayData, config) {
        let group = {
            other: {
                moduleList: [],
                use: []
            }
        };

        if (config.plugins.length) {
            config.plugins.forEach(function(plugin, i) {
                relayData.moduleList.forEach(function(item, j) {
                    let matchOne = false;

                    let extname = path.extname(item.dir);
                    plugin.exts.forEach(function(ext) {
                        if (extname === ext) {
                            group[`g${i}`] = group[`g${i}`] || {
                                moduleList: [],
                                use: plugin.use
                            };
                            group[`g${i}`].moduleList.push(item);
                            matchOne = true;
                        }
                    });

                    if (matchOne === false) {
                        group.other.moduleList.push(item);
                    }
                });
            });
        } else {
            group.other.moduleList = relayData.moduleList;
        }

        return group;
    }
}
const slueFS = require('slue-fs');
const slueStream = require('slue-stream');
const cssHandler = require('./csshandler');

module.exports = function(groupMap, modulesMap) {
    let promise = new Promise(function(resolve, reject) {
        let streams = [];
        for (let appKey in groupMap) {
            for (let groupKey in groupMap[appKey]) {
                let _con = groupMap[appKey][groupKey];
                let files = _con.moduleList.map(function(item) {
                    return item.dir;
                });

                if (files.length) {
                    let stream = slueFS.read(files, {
                        modulesMap: modulesMap,
                        entryName: appKey
                    }).pipe(cssHandler());

                    _con.use.forEach(function(plugin) {
                        stream = stream.pipe(plugin());
                    });

                    streams.push(stream);
                }
            }
        }

        if (streams.length) {
            resolve(slueStream.combine(streams));
        } else {
            reject();
        }
    });
    return promise;
}
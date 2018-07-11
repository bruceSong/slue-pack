const slueFS = require('slue-fs');
const slueStream = require('slue-stream');
const cssHandler = require('./csshandler');

module.exports = function(groupMap, modulesMap) {
    let promise = new Promise(function(resolve, reject) {
        let filesNumber = 0;
        let streams = [];
        for (let appKey in groupMap) {
            for (let groupKey in groupMap[appKey]) {
                let _con = groupMap[appKey][groupKey];
                let files = _con.moduleList.map(function(item) {
                    return item.dir;
                });

                if (files.length) {
                    filesNumber += files.length;
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
            resolve({
                stream: slueStream.combine(streams),
                filesNumber: filesNumber
            });
            //resolve(slueStream.combine(streams));
        } else {
            reject();
        }
    });
    return promise;
}
const slueFS = require('slue-fs');
const slueStream = require('slue-stream');
const cssHandler = require('./csshandler');

module.exports = function(groupMap, modulesMap) {
    let promise = new Promise(function(resolve) {
        let streams = [];
        for (let appKey in groupMap) {
            for (let groupKey in groupMap[appKey]) {
                let _con = groupMap[appKey][groupKey];
                //console.log(_con);
                let files = _con.moduleList.map(function(item) {
                    return item.dir;
                });

                if (files.length) {
                    // let stream = slueFS.read(files, {
                    //     modulesMap: modulesMap,
                    //     entryName: appKey
                    // }).pipe(cssHandler);
                    let stream = slueFS.read(files, {
                        modulesMap: modulesMap,
                        entryName: appKey
                    }).pipe(slueStream.transformObj(function(file, evn, cb) {
                        file = cssHandler(file);
                        cb(null, file);
                    }));

                    _con.use.forEach(function(plugin) {
                        stream = stream.pipe(plugin);
                    });

                    streams.push(stream);
                }
            }
        }

        if (streams.length) {
            console.log(streams.length);
            resolve(slueStream.combine(streams));
        }
    });
    return promise;
}
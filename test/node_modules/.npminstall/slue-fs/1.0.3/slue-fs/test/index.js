const slueFs = require('../index');
const slueStream = require('slue-stream');
slueFs.read('../lib/write/index.js').pipe(slueStream.transformObj(function(obj, env, cb) {
    //console.log(obj.relative);
    cb(null, obj);
})).pipe(slueFs.write('park'));
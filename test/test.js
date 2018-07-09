const fs = require('fs');
const path = require('path')
const sluePack = require('../index');
const slueStream = require('slue-stream');

const theTestPlugin = slueStream.transformObj(function(file, evn, cb) {
    //console.log(`the file path is '${file.path}'`);
    cb(null, file);
});

const theSeconePlugin = slueStream.transformObj(function(file, evn, cb) {
    //console.log(`the file contents is '${file.contents.toString()}'`);
    cb(null, file);
});

sluePack({
    externals: {
        'react': 'React'
    },
    plugins: [{
        exts: ['.js'],
        use: [theTestPlugin, theSeconePlugin]
    }],
    output: path.resolve(__dirname, './build/pkg')
})
// .pipe(slueStream.transformObj(function(file, env, cb) {
//     console.log(file.path);
//     cb(null, file);
// }));
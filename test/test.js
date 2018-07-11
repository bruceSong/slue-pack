const fs = require('fs');
const path = require('path')
const sluePack = require('../index');
const slueStream = require('slue-stream');

const getOnePlugin = function() {
    return slueStream.transformObj(function(file, env, cb) {
        cb(null, file);
    });
}

sluePack({
    externals: {
        'react': 'React'
    },
    plugins: [{
        exts: ['.js'],
        use: [getOnePlugin, getOnePlugin]
    }],
    output: path.resolve(__dirname, './build/pkg')
});
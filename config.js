var path = require('path');

module.exports = function(config) {
    let def = {
        entry: {
            app: './test/app.js'
        },
        output: path.resolve(__dirname, './test/build/pkg'),
        externals: {},
        watch: true,
        mode: 'production',
        ext: ['.js', '.jsx', '.css', '.less', '.html'],
        // 路径配置
        alias: {
            components: path.join(__dirname, './components')
        },
        plugins: []
    };
    return Object.assign(def, config);
}
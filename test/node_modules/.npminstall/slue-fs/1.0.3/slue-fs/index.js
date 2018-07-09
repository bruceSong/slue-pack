module.exports = {
    read: require('./lib/read'),
    write: require('./lib/write'),
    watch: require('glob-watcher')
};
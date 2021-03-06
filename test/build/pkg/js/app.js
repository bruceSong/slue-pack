/**
 * file: moudles.js
 * ver: 1.0.0
 * auth: 471665225@qq.com
 * update: 21:12 2016/8/2
 */

(function(self, modules) {
    var head = document.getElementsByTagName('head')[0];

    if (!self.__web__bound) {
        self.__web__bound = {
            modules: {},
            // 模块缓存
            modulesCache: {},
            // 用来处理require.async的回调
            loadingMap: {}
        };
    }

    var __modulesCache = self.__web__bound.modulesCache;
    var __modules = self.__web__bound.modules;
    var __loadingMap = self.__web__bound.loadingMap;

    if (!self.require) {
        var require = self.require = function(id) {
            id = require.alias(id);
            var mod = __modulesCache[id];
            if (mod) {
                return mod.exports;
            }
            mod = __modulesCache[id] = {
                'exports': {}
            };

            var factory = __modules[id];
            if (typeof factory === 'undefined') {
                throw Error('Cannot find module `' + id + '`');
            }
            var ret = factory.apply(mod, [require, mod.exports, mod]);
            if (ret) {
                mod.exports = ret;
            }
            return mod.exports;
        };

        require.async = function(ids, callback) {
            if (typeof ids === 'string') {
                ids = [ids];
            }

            var loadingNum = 0;

            for (var i = ids.length - 1; i >= 0; --i) {
                var id = require.alias(ids[i]);
                __loadingMap[id] = function() {
                    loadingNum--;
                    if (0 == loadingNum) {
                        var i, n, args = [];
                        for (i = 0, n = ids.length; i < n; ++i) {
                            args[i] = require(ids[i]);
                        }
                        var test = args[0].test;
                        callback && callback.apply(self, args);
                    }
                };
                loadingNum++;
                loadScript(id);
            }
        }

        require.alias = function(id) {
            return id
        };
    }

    var require = self.require;

    var loadScript = function(id) {
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = id;
        head.appendChild(script);
    }

    for (var m in modules) {
        __modules[m] = modules[m];
    }

    var absoluteuri = 'entry_file_module';
    if (window.__web__bound.loadingMap[absoluteuri]) {
        window.__web__bound.loadingMap[absoluteuri]();
        delete window.__web__bound.loadingMap[absoluteuri];
    }

    return require(absoluteuri);
})(this, {
    'entry_file_module': function(require, exports, module) {
        require('React');
        require('/Users/songgenlei/workspace/selfwork/development/slue-pack/test/ddd.js');
        require('/Users/songgenlei/workspace/selfwork/development/slue-pack/test/abc.js');


        require('/Users/songgenlei/workspace/selfwork/development/slue-pack/test/app1.js');
    },

    '/Users/songgenlei/workspace/selfwork/development/slue-pack/test/ddd.js': function(require, exports, module) {
        module.exports = function() {
            console.log('ddd');
        }
    },

    '/Users/songgenlei/workspace/selfwork/development/slue-pack/test/abc.js': function(require, exports, module) {
        module.exports = function() {
            console.log(123);
            console.log(111);
        }
    },

    '/Users/songgenlei/workspace/selfwork/development/slue-pack/test/app1.js': function(require, exports, module) {
        module.exports = function() {
            console.log('app1');
        }
    }
});
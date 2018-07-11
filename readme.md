# slue-fs

web打包工具，适用基于commonJs规范及es6规范的项目。

## 调用方法
```javascript
    sluePack(options);
```

## options配置如下
```javascript
    {
        // 入口文件
        entry: {
            app: './test/app.js'
        },
        // 打包输出目录
        output: path.resolve(__dirname, './test/build/pkg'),
        // 全局变量模块配置
        externals: {
            'react': 'React'
        },
        // 监听文件变化，开启增量编译摸索
        watch: true,
        // 环境变量，development or production
        mode: 'production',
        // 简洁路径配置
        alias: {
            components: path.join(__dirname, './components')
        },
        // 插件配置，适用于对require到的文件类型的扩展
        plugins: [{
            exts: ['.js'], // 插件适用于那些类型的文件
            use: [getOnePlugin, getOnePlugin] // 插件函数列表，函数需返回一个可读的流
        }]
    };
```

## 可以使用slue-stream或through2生成一个可写的流氓，插件实例如下
```javascript
    const slueStream = require('slue-stream');
    const getOnePlugin = function() {
        return slueStream.transformObj(function(file, env, cb) {
            /* 处理某种文件类型，并遵守commonJs规范*/
            cb(null, file);
        });
    }

    const through2 = require('through2');
    const getOnePlugin = function() {
        return through2.obj(function(file, env, cb) {
            /* 处理某种文件类型，并遵守commonJs规范*/
            cb(null, file);
        });
    }
```
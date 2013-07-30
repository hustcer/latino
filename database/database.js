
/**
 * 数据库配置信息
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author: 	hustcer
 * Date: 	2012-1-20
 */

var fs          = require('fs'),
    path        = require('path');

var confFile    = path.normalize(__dirname + '/../conf/conf.json');

// 数据库配置文件不存在则尝试采用匿名方式访问
if ( !fs.existsSync(confFile) ){

    console.log('[INFO]----Can not find database config file ' + confFile + ', using default config...');

    exports.db      = require('mongoskin').db('localhost:27017/dance');

}else{

    console.log('[INFO]----Connect to database using config file ' + confFile);


    var data        = JSON.parse(fs.readFileSync(confFile));

    // NOTICE: 原来认证信息只在admin数据库里面添加就可以了，现在还需要在dance数据库里面添加认证信息，否则会提示：‘MongoError: auth fails’
    exports.db      = require('mongoskin').db('localhost:27017/dance', {
        auto_reconnect : true,
        safe           : true,
        // 可以省略，省略则跟url里面的数据库相同
        authSource     : 'dance',
        username       : data.dbAuth.username,
        password       : data.dbAuth.password
    });

}






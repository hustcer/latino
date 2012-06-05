
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
if ( !path.existsSync(confFile) ){

    console.log('[INFO]----Can not find database config file ' + confFile + ', using default config...');

    exports.db      = require('mongoskin').db('localhost:27017/dance');

}else{

    console.log('[INFO]----Connect to database using config file ' + confFile);

    var data        = JSON.parse(fs.readFileSync(confFile));
    var connection  = 'mongo://' + data.dbAuth.username + ':' + data.dbAuth.password + '@localhost:27017/dance';
    exports.db      = require('mongoskin').db(connection);

}

    




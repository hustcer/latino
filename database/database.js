
/**
 * 数据库配置信息
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author: 	hustcer
 * Date: 	2012-1-20   
 */

var fs          = require('fs'),
    path        = require('path');

var confFile    = __dirname + '/../conf/conf.json';

// 邮箱配置文件不存在则停止发邮件
if ( !path.existsSync(confFile) ){

    console.log('Can Not Find Database Config File ' + confFile + ', Using Default Config...');

    exports.db      = require('mongoskin').db('localhost:27017/dance');

}else{

    console.log('Connect to Database Using Config File ' + confFile);

    var data        = JSON.parse(fs.readFileSync(confFile));
    var connection  = 'mongo://' + data.dbAuth.username + ':' + data.dbAuth.password + '@localhost:27017/dance';
    exports.db      = require('mongoskin').db(connection);

}

    




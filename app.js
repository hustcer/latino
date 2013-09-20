/**
 * For More Reference about Package Format, Please Visit: http://package.json.nodejitsu.com/
 * Logger config reference: http://www.senchalabs.org/connect/logger.html
 * NODE_ENV=production forever start -m 1000 -a -l /tmp/latinode/out.log -e /tmp/latinode/err.log app.js -p 8024
 */

/**
 * App's Main Start Script, Usage:
 * node app.js -p 8024; '-p' stands for the port number;
 * Author:  hustcer
 * Date:    2012-1-19 
 */

var express     = require('express');

var path        = require('path'),
    http        = require('http'),
    app         = express(),
    db          = require("./database/database.js").db,
    cCourses    = require("./database/course.js").cCourses,
    dancerOp    = require("./database/dancer.js").commonDancerOp;

var gRouterMap  = require('./routes/router.node.js').gRouter,
    pRouterMap  = require('./routes/router.node.js').pRouter,
    agRouterMap = require('./routes/router.node.js').adminRouter,
    apRouterMap = require('./routes/router.node.js').adminPostRouter;
    

// Configuration
app.configure(function(){

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    // app.use(express.logger({ format: ':method :url' }));
    app.use(express.bodyParser());
    app.use(express.methodOverride());

});

/**
 * 绑定数据库collection及相应方法，配置请求响应路由
 * @param fullFeature   是否启用所有功能，包括管理员权限功能
 */
var setRouters = function( fullFeature ){
    // 将相应的操作绑定到Collection上
    // 顺便也将对应舞种的当前开课信息也绑定到相应舞种上
    dancerOp.cCourse = cCourses.cLatin;
    db.bind('latin' , dancerOp);
    dancerOp.cCourse = cCourses.cJazz;
    db.bind('jazz'  , dancerOp);
    dancerOp.cCourse = cCourses.cHiphop;
    db.bind('hiphop', dancerOp);

    // 管理员相关功能，目前只允许测试环境下访问
    if( fullFeature ){
        for (router in agRouterMap) {
            app.get(router, agRouterMap[router]);
        }
        for (router in apRouterMap) {
            app.post(router, apRouterMap[router]);
        }
    }

    // 普通用户get请求
    for (router in gRouterMap) {
        app.get(router, gRouterMap[router]);
    }
    // 普通用户post请求
    for (router in pRouterMap) {
        app.post(router, pRouterMap[router]);
    }
};

app.configure('development', function(){

    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack:      true
    }));

    // 静态资源路由
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(app.router);
    setRouters(true);
    
});

app.configure('production', function(){

    var oneMonth = 1000*60*60*24*30;
    app.use(express.errorHandler());

    // 静态资源路由
    app.use(express.static(path.join(__dirname, 'public'), { maxAge: oneMonth } ));

    app.use(app.router);
    setRouters(false);
    
});

// 如果控制台传过来的有端口号参数则监听相应端口号，否则监听3000端口
var portIndex  = process.argv.indexOf('-p'), port = 3000;

if (portIndex != -1 && process.argv.length >= portIndex + 2) {
    port = +process.argv[portIndex + 1];
};

http.createServer(app).listen(port, function(){
    console.log("\nExpress server listening on port %d in %s mode\n", port, app.settings.env);
});


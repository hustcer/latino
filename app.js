/**
 * For More Reference about Package Format, Please Visit: http://package.json.nodejitsu.com/
 */

/**
 * Module dependencies.
 *
 * Author:  justin.maj
 * Date:    2012-1-19 
 */

var express     = require('express');

var app         = module.exports = express.createServer(),
    db          = require("./database/database.js").db,
    cCourse     = require("./database/course.js").currentCourse,
    dancerOp    = require("./database/dancer.js").commonDancerOp;

var gRouterMap  = require('./routes/router.node.js').gRouter,
	pRouterMap  = require('./routes/router.node.js').pRouter,
    agRouterMap = require('./routes/router.node.js').adminRouter,
    apRouterMap = require('./routes/router.node.js').adminPostRouter;
    

// Configuration
app.configure(function(){

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());

});

/**
 * 绑定数据库collection及相应方法，配置请求响应路由
 * @param fullFeature   是否启用所有功能，包括管理员权限功能
 */
var setRouters = function( fullFeature ){
    // 将相应的操作绑定到Collection上
    db.bind(cCourse.courseType, dancerOp);

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
        // console.log("\nHandle Get Path:'" + router + "' \tHandler: " + gRouterMap[router]);
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
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
    setRouters(true);
});

app.configure('production', function(){

    var oneMonth = 1000*60*60*24*30;
    app.use(express.errorHandler());
    // 静态资源路由
    app.use(express.static(__dirname + '/public', { maxAge: oneMonth }));
    app.use(app.router);
    setRouters(false);
});

app.listen(3000);

console.log("\nExpress server listening on port %d in %s mode\n", app.address().port, app.settings.env);




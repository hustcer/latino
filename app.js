
/**
 * Module dependencies.
 *
 * Author: justin.maj
 * Date: 2012-1-19 
 */

var express = require('express');

var app = module.exports = express.createServer();

var gRouterMap = require('./routes/router.js').gRouter,
	pRouterMap = require('./routes/router.js').pRouter;

var db = require("./database/database.js").db;
var dancerOp = require("./database/dancer.js").commonDancerOp;

// Configuration
app.configure(function(){

    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    // app.set('view options', { layout: false });
    app.use(express.bodyParser());
    app.use(express.methodOverride());
	// 注意顺序，为了能够正确定向到404页面，要把这个提前，否则请求静态资源也会跳转到404。
    app.use(express.static(__dirname + '/public'));
	
    app.use(app.router);
    
});

app.configure('development', function(){
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

db.bind("latin", dancerOp);

for (router in gRouterMap) {
//    console.log("\nHandle Get Path:'" + router + "' \tHandler: " + gRouterMap[router]);
    app.get(router, gRouterMap[router]);
}

for (router in pRouterMap) {
//    console.log("\nHandle Post Path:'" + router + "' \tHandler: " + pRouterMap[router]);
    app.post(router, pRouterMap[router]);
}

app.listen(3000);

console.log("\nExpress server listening on port %d in %s mode\n", app.address().port, app.settings.env);

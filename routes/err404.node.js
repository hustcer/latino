
/**
 * GET 404 page.
 *
 * Author: 	hustcer
 * Date: 	2012-1-19   
 */

var getCollection   = require("./util.node.js").getCollection;

exports.err404 = function(req, res){
	var col = getCollection(req);

    res.render('err404', {
        status:  404,
        title: 	 'Dance @ Alibaba',
        cCourse: col.cCourse,
        msg: 	 '不好意思哈! 您访问的链接不存在或者您没有足够的权限！'
    });
};

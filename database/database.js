
/**
 * 数据库配置信息
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author: 	hustcer
 * Date: 	2012-1-20   
 */
var cCourse 	= require("./course.js").currentCourse;

var dbMongo 	= exports.db = require('mongoskin').db('localhost:27017/dance');

// 根据当前开课的舞种返回对应要操作的Collection
exports.collection = dbMongo.collection(cCourse.courseType);
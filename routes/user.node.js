/**
 * User operations.
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author: 	hustcer
 * Date: 	2012-2-13 
 */


// 取得课程值以及对应的中文描述映射信息
var cCoursesList  	= require("../database/course.js").cCoursesList;
var getCollection 	= require("./util.node.js").getCollection;

/*
 * 显示某一用户报名信息.
 */
exports.user = function(req, res, next){

	var col = getCollection(req);
	var cList 	= cCoursesList[col.cCourse.courseType + 'List'];

	col.findOne( {dancerID: req.params.id}, function(err, result) {

	  	if (result) {
	  		
	  		// 将课程的value替换成对应的易于阅读的中文描述
	  		if (result.courses && result.courses.length > 0) {
	  			var courseNames = [];
	  			for (var i = 0, n = result.courses.length ; i < n; i++) {
	  				// 只统计报名通过的课程
	  				if (result.courses[i].status === 'approved') {
	  					for (var m = cList.length - 1; m >= 0; m--) {
		  					if (cList[m].courseVal === result.courses[i].courseVal) {
		  						courseNames.push(cList[m].courseName);
		  						break;
		  					};
		  				};
	  				};
		  		};
	  		};
	  		result.courses = courseNames;

	    	res.render('user', {
		        title: 		'舞者信息',
		        cCourse: 	col.cCourse,
		        dancer: 	result
		    });

	  	} else {
			// TODO: 如果会员不存在，直接给于提示不要抛出异常
	    	// next(new Error('Failed to load user ' + req.params.id));
	    	console.log('This Dancer Dose Not Exist, DancerID:', req.params.id);
	  	}

	});

};


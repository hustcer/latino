/**
 * Dancer list page
 *
 * Author: 	hustcer
 * Date: 	2012-2-12   
 */

var col 		= require("../database/database.js").collection;
var cCourse 	= require("../database/course.js").currentCourse;
var courseList 	= require("../database/course.js").courseList;


/*
 * 会员信息列表接口. 默认情况应当以当前开设课程为查询条件
 */
exports.list = function(req, res){

	res.render('list', {
        title: 		'课程报名信息',
        courseList: courseList,
        cCourse: 	cCourse	    
    });
	
};

/*
 * 查询满足条件的会员的邮件列表
 */
exports.queryEmail = function(req, res){
	var dancerModel = {};
	// 根据课程状态，是否缴费来进行查询
	if (!!req.query.dancerID)		{dancerModel.dancerID 	= req.query.dancerID;};
	if (!!req.query.gender) 		{dancerModel.gender 	= req.query.gender;};
	if (!!req.query.department) 	{dancerModel.department = req.query.department;};

	// 内嵌文档精确匹配
	dancerModel.courses = {};
	dancerModel.courses.$elemMatch = {};
	if (!!req.query.course) {
		dancerModel.courses.$elemMatch.courseVal = req.query.course;
	};
	if (!!req.query.status) {
		dancerModel.courses.$elemMatch.status = req.query.status;
	};
	if (!!req.query.paid) {
		// req.body.paid取得的是“true”、“false”字符串，需要转换
		dancerModel.courses.$elemMatch.paid = JSON.parse(req.query.paid);
	};

	// FIXME: 如果课程没有任何匹配条件就把该条件完全去掉,这种方法挺猥琐的感觉，以后可以改进下
	if (JSON.stringify(dancerModel.courses.$elemMatch) === '{}') {
		delete dancerModel.courses;
	};
	// console.log('User Current Search Condition:', dancerModel);

	col.findDancerByCondition(dancerModel, function(err, result) {

	    if (err) throw err;

	    var emailArray = [];
	    for(var i = 0, l = result.length; i < l; i++ ){
	    	emailArray.push(result[i].email);
	    }
		res.contentType('application/json');
		res.send({data:emailArray.join(';')});

	});

};

/*
 * 会员列表筛选/搜索接口. TODO: 需要提示用户当前搜索条件
 */
exports.search = function(req, res){

	var dancerModel = {};
	// 根据课程状态，是否缴费来进行查询
	if (!!req.body.dancerID) 	{dancerModel.dancerID 	= req.body.dancerID;};
	if (!!req.body.gender) 		{dancerModel.gender 	= req.body.gender;};
	if (!!req.body.department) 	{dancerModel.department = req.body.department;};

	// 内嵌文档精确匹配
	dancerModel.courses = {};
	dancerModel.courses.$elemMatch = {};
	if (!!req.body.course) {
		dancerModel.courses.$elemMatch.courseVal = req.body.course;
	};
	if (!!req.body.status) {
		dancerModel.courses.$elemMatch.status = req.body.status;
	};
	if (!!req.body.paid) {
		// req.body.paid取得的是“true”、“false”字符串，需要转换
		dancerModel.courses.$elemMatch.paid = JSON.parse(req.body.paid);
	};

	// FIXME: 如果课程没有任何匹配条件就把该条件完全去掉,这种方法挺猥琐的感觉，以后可以改进下
	if (JSON.stringify(dancerModel.courses.$elemMatch) === '{}') {
		delete dancerModel.courses;
	};
	// console.log('User Current Search Condition:', dancerModel);

	col.findDancerByCondition(dancerModel, function(err, result) {

	    if (err) throw err;

		res.contentType('application/json');
		res.send({data:result});

	});

};




var db = require("../database/database.js").db;
var cCourse = require("../database/course.js").currentCourse;
var courseList = require("../database/course.js").courseList;


/*
 * 会员信息列表接口. TODO: 默认情况应当以当前开设课程为查询条件
 */
exports.list = function(req, res){
	// TODO: 默认查当前开设的两门课程中，所有课程报名审核通过，且已经缴费的会员.需要提示用户当前搜索条件
	var condition = {'courses.courseVal':{$in: [cCourse.courseA.cValue, cCourse.courseB.cValue]},
					 'courses.status':'approved', 'courses.paid':true};

	db.collection('latin').find(condition).toArray(function(err, result) {

	    if (err) throw err;
	    //console.log(result);

		res.render('list', {
	        title: 		'课程报名信息',
	        courseList: courseList,
	        dancerList: result
	    });
	});

};

/*
 * 会员列表筛选/搜索接口. TODO: 需要提示用户当前搜索条件
 */
exports.search = function(req, res){

	var dancerModel = {};
	// 根据课程状态，是否缴费来进行查询
	if (!!req.body.dancerID) {dancerModel.dancerID = req.body.dancerID;};
	if (!!req.body.course) {dancerModel['courses.courseVal']= req.body.course;};
	if (!!req.body.status) {dancerModel['courses.status']= req.body.status;};
	// req.body.paid取得的是“true”、“false”字符串，需要转换
	if (!!req.body.paid) {dancerModel['courses.paid']= JSON.parse(req.body.paid);};
	if (!!req.body.gender) {dancerModel.gender = req.body.gender;};
	if (!!req.body.department) {dancerModel.department = req.body.department;};

	console.log('User Current Search Condition:', dancerModel);

	db.collection('latin').find(dancerModel).toArray(function(err, result) {

	    if (err) throw err;
	    //console.log(result);

		res.contentType('application/json');
		res.send({data:result});

	});

};


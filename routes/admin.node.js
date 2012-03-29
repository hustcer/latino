/**
 * GET 404 page.
 *
 * Author: 	justin.maj
 * Date: 	2012-2-13   
 */

var db 		= require("../database/database.js").db;
// 取得课程值以及对应的中文描述映射信息
var cList 	= require("../database/course.js").courseList;


exports.man = function(req, res, next){

	res.render('admin', {
        title: 		'管理员后台',
        courseList: cList
    });

};


/*
 * 设置会员为某课程缴费. eg:http://localhost:3000/man/pay/29411?courseVal=13CB
 * 注意只有课程状态为 approved 的，即报名通过的用户才可以设置其状态为缴费
 */
exports.pay = function(req, res){

	console.log("Set Some Course To Be Paid For User With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	
	checkCourseStatus(req, res, 'approved', function(){
		db.latin.updateDancerPayStatus(req.params.id, req.query.courseVal, true, function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员未为某课程缴费. eg:http://localhost:3000/man/unpay/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied、quit 的，即申请过退课的用户才可以退费
 */
exports.unpay = function(req, res){

	console.log("Set Some Course To Be Unpaid For User With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	
	checkCourseStatus(req, res, 'quitApplied', function(){

		db.latin.updateDancerPayStatus(req.params.id, req.query.courseVal, false, function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员报名成功. eg:http://localhost:3000/man/approve/29411?courseVal=13CB
 * 注意只有课程状态为 waiting 的才可以报名审核通过
 */
exports.approve = function(req, res){

	console.log("Approve Course With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	checkCourseStatus(req, res, 'waiting', function(){

		db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'approved', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员报名不通过. eg:http://localhost:3000/man/refuse/29411?courseVal=13CB
 * 注意只有课程状态为 waiting 的才可以报名审核不通过
 */
exports.refuse = function(req, res){

	console.log("Refuse Course With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'waiting', function(){

		db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'refused', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
	
};


/*
 * 设置会员退课成功. eg:http://localhost:3000/man/quit/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied 且已经退费，或者未缴费时，发出过退课申请的用户才可以退课成功
 */
exports.quit = function(req, res){

	console.log("Quit Course With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'quitApplied', function(){

		checkPayStatus(req, res, false, function(){
			db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'quit', function(err, result) {
			    if (err) throw err;

			    res.contentType('application/json');
			    res.send({success:true});
			});
		});
		
	});
	
};

/*
 * 设置拒绝会员退课. eg:http://localhost:3000/man/quitRefuse/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied 时，发出过退课申请的用户才可以拒绝退课
 */
exports.quitRefuse = function(req, res){

	console.log("Refuse Quiting Course With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'quitApplied', function(){

		db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'approved', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
		
	});
	
};


/*
 * 这里的查询条件还要加上对应的课程，否则result.courses.status 未定义
 * 检查会员课程状态
 * @param req.query.courseVal query字符串中要有course的值
 * @param status 	期望的状态
 * @param callback 	满足期望状态后执行的回调
 */
var checkCourseStatus = function(req, res, status, callback){

	db.latin.findDancerByID(req.params.id, function(err, result){
		if (err) throw err;
		var satisfied = false;

		// 会员不存在或者没有报名任何课程
		if (!(!!result && !!result.courses && result.courses.length > 0)){
			res.send({success:false, msg:'Dancer Dose Not Exist Or Has No Course !'});
			// 如果不return后面for block会继续被执行
			return;
		}

		for (var i = result.courses.length - 1; i >= 0; i--) {
			if (result.courses[i].courseVal === req.query.courseVal &&
				result.courses[i].status === status) {

				satisfied = true;
				console.log("Course Status Satisfied With Status: " + status, ',For Dancer With ID:', req.params.id);
				
				callback();
				break;
			};
		};
		
		if (!satisfied) {
			res.send({success:false, msg:'Your Course Status Is Not Satisfied For This Operation!'});
		};
		
	});
};

/*
 * 这里的查询条件还要加上对应的课程，否则result.courses.isPaid 未定义
 * 检查会员缴费状态
 * @param req.query.courseVal query字符串中要有course的值
 * @param isPaid 	期望的缴费状态
 * @param callback 	满足期望状态后执行的回调
 */
var checkPayStatus = function(req, res, isPaid, callback){

	db.latin.findDancerByID(req.params.id, function(err, result){
		if (err) throw err;
		var satisfied = false;

		// 会员不存在或者没有报名任何课程
		if (!(!!result && result.courses && result.courses.length > 0)){
			res.send({success:false, msg:'Dancer Dose Not Exist Or Has No Course !'});
			// 如果不return后面for block会继续被执行
			return;
		}

		for (var i = result.courses.length - 1; i >= 0; i--) {
			
			if (result.courses[i].courseVal === req.query.courseVal &&
				result.courses[i].paid === isPaid) {

				satisfied = true;
				console.log("Pay Status Satisfied With Status: " + isPaid, ', For Dancer With ID:', req.params.id);
				
				callback();
				break;
			};
		};
		
		if (!satisfied) {
			res.send({success:false, msg:'Your Pay Status Is Not Satisfied For This Operation!'});
		};
		
	});
};


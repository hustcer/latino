/**
 * GET 404 page.
 *
 * Author: 	hustcer
 * Date: 	2012-2-13   
 */

// 取得课程值以及对应的中文描述映射信息
var cList  			= require("../database/course.js").cCoursesList;
var nodeMsg 		= require("../conf/nodemsg.node.js").nodeMessages;
var getCollection 	= require("./util.node.js").getCollection;
var sendMail 		= require("./mail.node.js").sendMail;

exports.man = function(req, res, next){

	var col = getCollection(req);

	res.render('admin', {
        title: 		'管理员后台',
        courseList: cList[col.cCourse.courseType + 'List'],
        cCourse: 	col.cCourse
    });

};


/*
 * 设置会员为某课程缴费. eg:http://localhost:3000/man/pay/latin/29411?courseVal=13CB
 * 注意只有课程状态为 approved 的，即报名通过的用户才可以设置其状态为缴费
 */
exports.pay = function(req, res){

	var col = getCollection(req);

	console.log("Set Paid For User With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	
	checkCourseStatus(req, res, 'approved', function(){
		col.updateDancerPayStatus(req.params.id, req.query.courseVal, true, function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员未为某课程缴费. eg:http://localhost:3000/man/unpay/latin/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied、quit 的，即申请过退课的用户才可以退费
 */
exports.unpay = function(req, res){

	var col = getCollection(req);

	console.log("Set Unpaid For User With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	
	checkCourseStatus(req, res, 'quitApplied', function(){

		col.updateDancerPayStatus(req.params.id, req.query.courseVal, false, function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员报名成功. eg:http://localhost:3000/man/approve/latin/29411?courseVal=13CB
 * 注意只有课程状态为 waiting 的才可以报名审核通过
 */
exports.approve = function(req, res){

	var col = getCollection(req);

	console.log("Approve Course With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	checkCourseStatus(req, res, 'waiting', function(){

		col.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'approved', function(err, result) {
		    if (err) throw err;

		    col.findDancerEmailByID(req.params.id, function(err, dancer){
		    	if (err) throw err;
		    	sendMail(dancer.email, '您的报名申请已审核通过', col.cCourse.successMsg + '课程类型：' + req.query.courseVal);
		    });

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员报名不通过. eg:http://localhost:3000/man/refuse/latin/29411?courseVal=13CB
 * 注意只有课程状态为 waiting 的才可以报名审核不通过
 */
exports.refuse = function(req, res){

	var col = getCollection(req);

	console.log("Refuse Course With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'waiting', function(){

		col.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'refused', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
	
};


/*
 * 设置会员退课成功. eg:http://localhost:3000/man/quit/latin/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied 且已经退费，或者未缴费时，发出过退课申请的用户才可以退课成功
 */
exports.quit = function(req, res){

	var col = getCollection(req);

	console.log("Quit Course With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'quitApplied', function(){

		checkPayStatus(req, res, false, function(){
			col.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'quit', function(err, result) {
			    if (err) throw err;

			    col.findDancerEmailByID(req.params.id, function(err, dancer){
			    	if (err) throw err;
			    	sendMail(dancer.email, '您的退课申请已审核通过', col.cCourse.quitMsg + '课程类型：' + req.query.courseVal);
			    });

			    res.contentType('application/json');
			    res.send({success:true});
			});
		});
		
	});
	
};

/*
 * 设置拒绝会员退课. eg:http://localhost:3000/man/quitRefuse/latin/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied 时，发出过退课申请的用户才可以拒绝退课
 */
exports.quitRefuse = function(req, res){

	var col = getCollection(req);

	console.log("Refuse Quiting With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'quitApplied', function(){

		col.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'approved', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
		
	});
	
};

/*
 * 管理员修改保存会员信息. eg:http://localhost:3000/man/editDancer/latin
 * 
 */
exports.editDancer = function(req, res){
	var col = getCollection(req);

	var dancerModel = {
		dancerID: 	req.body.dancerID,
		dancerName: req.body.dancerName,
		gender: 	req.body.gender,
		email: 		req.body.email,
		wangWang: 	req.body.wangWang,
		extNumber: 	req.body.extNumber,
		alipayID: 	req.body.alipayID,
		vip: 		req.body.vip,
		level: 		req.body.level,
		forever: 	req.body.forever,
		department: req.body.department
	};

	col.findDancerByID( dancerModel.dancerID, function(err, result) {
	    if (err) throw err;
	    
	    // 之所以要把新插入会员和更新会员信息分开处理而不采用upsert模式，
	    // 一方面是要设置会员创建时间，另一方面是为了明确操作逻辑，避免意外
	    // 会员存在则更新会员信息
	    if (!!result) {
	    	col.updateDancerByAdmin(dancerModel.dancerID, dancerModel, function(err) {
	    		if (err) throw err;

	    		// 表单提交成功后返回首页, 没有错误消息就是好消息
	    		res.send();
	    		// res.redirect('back');
	    		// res.send({success:true, msg:'Dancer Information Updated Successfully!'});
	    	});
			
	    }

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

	var col = getCollection(req);

	col.findDancerByID(req.params.id, function(err, result){
		if (err) throw err;
		var satisfied = false;

		// 会员不存在或者没有报名任何课程
		if (!(!!result && !!result.courses && result.courses.length > 0)){
			res.send({success:false, msg:nodeMsg.notExist});
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
			res.send({success:false, msg:nodeMsg.condUnMeet});
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

	var col = getCollection(req);

	col.findDancerByID(req.params.id, function(err, result){
		if (err) throw err;
		var satisfied = false;

		// 会员不存在或者没有报名任何课程
		if (!(!!result && result.courses && result.courses.length > 0)){
			res.send({success:false, msg:nodeMsg.notExist});
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
			res.send({success:false, msg:nodeMsg.payUnMeet});
		};
		
	});
};


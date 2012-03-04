
/*
 * GET home page.
 */
var db = require("../database/database.js").db;
// 取得课程值以及对应的中文描述映射信息
var cList = require("../database/course.js").courseList;

exports.user = function(req, res, next){

	db.collection('latin').findOne( {dancerID: req.params.id}, function(err, result) {

	  	if (result) {
	  		var courseNames = [];
	  		// 将课程的value替换成对应的易于阅读的中文描述
	  		if (result.courses && result.courses.length > 0) {
	  			for (var i = 0, n = result.courses.length ; i < n; i++) {
	  				
	  				for (var m = cList.length - 1; m >= 0; m--) {
	  					if (cList[m].courseVal === result.courses[i].courseVal) {
	  						courseNames.push(cList[m].courseName);
	  						break;
	  					};
	  				};
	  				
		  		};
	  		};
	  		result.courses = courseNames;

	    	res.render('user', {
		        title: 	'用户报名信息:',
		        dancer: result
		    });

	  	} else {
	  		// TODO: 如果会员不存在，直接给于提示不要抛出异常
	    	next(new Error('Failed to load user ' + req.params.id));
	  	}

	});

};

/*
 * 设置会员为某课程缴费. eg:http://localhost:3000/man/pay/29411?courseVal=13CB
 * 注意只有课程状态为 approved 的，即报名通过的用户才可以设置其状态为缴费
 */
exports.pay = function(req, res){

	console.log("Set some course to be paid by user with ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	
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
 * TODO: UNPAY FOR quit
 */
exports.unpay = function(req, res){

	console.log("Set some course to be paid by user with ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	
	checkCourseStatus(req, res, 'quitApplied', function(){

		console.log("Check Satisfied Executing Callback!");
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

	console.log("approve course with ID: "+ req.params.id + " courseVal: " + req.query.courseVal)
	checkCourseStatus(req, res, 'waiting', function(){

		console.log("Check Satisfied Executing Callback!");
		db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'approved', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
};

/*
 * 设置会员报名成功. eg:http://localhost:3000/man/refuse/29411?courseVal=13CB
 * 注意只有课程状态为 waiting 的才可以报名审核不通过
 */
exports.refuse = function(req, res){

	console.log("Refuse Course With ID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'waiting', function(){
		console.log("Check Satisfied Executing Callback!");
		db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'refused', function(err, result) {
		    if (err) throw err;

		    res.contentType('application/json');
		    res.send({success:true});
		});
	});
	
};


/*
 * 设置会员报名成功. eg:http://localhost:3000/man/quit/29411?courseVal=13CB
 * 注意只有课程状态为 quitApplied 即发出过退课申请的用户才可以退课成功
 * TODO:审核退课的时候最好检查下是否已经退费
 */
exports.quit = function(req, res){

	console.log("Quit Course With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	checkCourseStatus(req, res, 'quitApplied', function(){
		console.log("Check Satisfied Executing Callback!");
		db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'quit', function(err, result) {
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
	console.log("Check Course Status: " + status);

	db.latin.findDancerByID(req.params.id, function(err, result){
		if (err) throw err;
		var satisfied = false;

		for (var i = result.courses.length - 1; i >= 0; i--) {
			if (result.courses[i].courseVal === req.query.courseVal &&
				result.courses[i].status === status) {

				satisfied = true;
				console.log("Status Satisfied: " + status);
				callback();
				break;
			};
		};
		
		if (!satisfied) {
			res.send({success:false, msg:'Your Course Status Is Not Satisfied For This Operation!'});
		};
		
	});
}

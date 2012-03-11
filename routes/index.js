

var db = require("../database/database.js").db;
// 当前开课信息
var cCourse = require("../database/course.js").currentCourse;
var Step = require('step');

/*
 * GET home page.
 */
exports.index = function(req, res){
	// TODO: DO IT USING STEP!
	Step(
			function countByCondition(){
				db.latin.countDancerByCondition(
					{ courses:{$elemMatch: {'courseVal':cCourse.courseA.cValue,'status':'waiting'}}}, this);
			},
			function fillResult(err, count){
				if (err) throw err;
				cCourse.courseA.total = count;
				return cCourse;
			},
			function countByCondition(){
				db.latin.countDancerByCondition(
					{ courses:{$elemMatch: {'courseVal':cCourse.courseA.cValue,'status':'approved'}}}, this);
			},
			function fillResult(err, count){
				if (err) throw err;
				cCourse.courseA.approved = count;
				// 申请报名总人数等于处于申请审核状态的人数加报名成功的人数
				cCourse.courseA.total += count;
				return cCourse;
			},
			function countByCondition(){
				db.latin.countDancerByCondition(
					{ courses:{$elemMatch: {'courseVal':cCourse.courseB.cValue,'status':'waiting'}}}, this);
			},
			function fillResult(err, count){
				if (err) throw err;
				cCourse.courseB.total = count;
				return cCourse;
			},
			function countByCondition(){
				db.latin.countDancerByCondition(
					{ courses:{$elemMatch: {'courseVal':cCourse.courseB.cValue,'status':'approved'}}}, this);
			},
			function fillResult(err, count){
				if (err) throw err;
				cCourse.courseB.approved = count;
				// 申请报名总人数等于处于申请审核状态的人数加报名成功的人数
				cCourse.courseB.total += count;
				return cCourse;
			},
			// 渲染页面，注意这个也需要放在Step里面，不然可能出现页面渲染的时候数据还没有生成导致渲染出来的部分数据为空的情况
			function renderIndex(){
				res.render('index', {
			        title: 			'Alibaba 拉丁培训',
			        cCourse: 		cCourse,
			        showDancerLink: false
			    });
			}
			
		);

    
};

/*
 * 会员注册、报名课程、更新个人信息.注意：课程只能报名添加不能随意删除。
 */
exports.apply = function(req, res){

	var dancerModel = {
		dancerID: 	req.body.dancerID,
		courseA: 	req.body.courseA,
		courseB: 	req.body.courseB,
		dancerName: req.body.dancerName,
		gender: 	req.body.gender,
		email: 		req.body.email,
		wangWang: 	req.body.wangWang,
		extNumber: 	req.body.extNumber,
		alipayID: 	req.body.alipayID,
		department: req.body.department
	};

	db.latin.findDancerByID(dancerModel.dancerID, function(err, result) {
	    if (err) throw err;
	    
	    // 之所以要把新插入会员和更新会员信息分开处理而不采用upsert模式，
	    // 一方面是要设置会员创建时间，另一方面是为了明确操作逻辑，避免意外
	    // 会员存在则更新会员信息
	    if (!!result) {
	    	db.latin.updateDancerByID(dancerModel.dancerID, dancerModel, function(err, result) {
	    		if (err) throw err;
	    		if (result) {
	    			console.log('Dancer Infomation Updated With ID:',dancerModel.dancerID,
	    						' DancerName:', dancerModel.dancerName);
	    			
	    		};
	    	});
			
		// 会员不存在则插入会员信息
	    }else{
	    	db.latin.insertDancer(dancerModel, function(err, addResult) {
			    if (err) throw err;

			    if (addResult) {
				    console.log('New Dancer Added, With ID:',dancerModel.dancerID,
	    						' DancerName:', dancerModel.dancerName);
			    }
			});
	    }

	    // 表单提交成功后返回首页
	    // res.redirect('back');
		res.render('index', {
	        title: 			'Alibaba 拉丁培训',
	        cCourse: 		cCourse,
	        showDancerLink: true,
	        dancerID: 		dancerModel.dancerID
	    });

	});
    
};

/*
 * 查询会员信息. eg:http://localhost:3000/queryDancer/29411
 */
exports.queryDancer = function(req, res){

	db.latin.findDancerByID(req.params.id, function(err, result) {
	    if (err) throw err;

	    res.contentType('application/json');

	    if (!!result) {
	    	res.send({data:result});

	    }else{
	    	res.send({data:null});
	    }
	    
	});

};

/*
 * 查询会员信息. eg:http://localhost:3000/quitCourse/29411?courseVal=13CB
 */
exports.quitCourse = function(req, res){

	console.log("Applying Course Quiting With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'quitApplied', function(err, result) {
	    if (err) throw err;

	    res.contentType('application/json');
	    res.send({success:true});
	    
	});

};

/*
 * 会员取消课程报名. eg:http://localhost:3000/cancelCourse/29411?courseVal=13CB
 */
exports.cancelCourse = function(req, res){

	console.log("Course Cancel With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	db.latin.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'cancelled', function(err, result) {
	    if (err) throw err;

	    res.contentType('application/json');
	    res.send({success:true});
	    
	});

};

/*
 * 初始化测试数据，该代码上线后应当被移除. eg:http://localhost:3000/init/initdata
 */
exports.initdata = function(req, res){
	var dancerModel;
	for (var i = 60; i >= 10; i--) {

		var insertDancer = function(i){
			dancerModel = {
				dancerID: 	'299' + i,
				courseA: 	Math.ceil(Math.random()*3) + 'RE',
				courseB: 	Math.ceil(Math.random()*3) + 'CI',
				dancerName: 'M.J.' + i,
				gender: 	Math.random() >= 0.5 ? 'male':'female',
				email: 		'hustcer' + i + '@alibaba-inc.com',
				wangWang: 	'hustcer' + i,
				extNumber: 	'599' + i,
				alipayID: 	'hustcer' + i + '@gmail.com',
				department: Math.random() >= 0.5 ? 'tech':'other'
			};
			// console.log(dancerModel);

			db.latin.insertDancer(dancerModel, function(err, addResult) {
			    if (err) throw err;

			    if (addResult) {
				    // console.log(dancerModel.dancerName + ' Added!');
			    }
			});

		};
		insertDancer(i);

	};
	
	res.send({success:true});
};

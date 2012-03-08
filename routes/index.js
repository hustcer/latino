

var db = require("../database/database.js").db;
// 当前开课信息
var cCourse = require("../database/course.js").currentCourse;

/*
 * GET home page.
 */
exports.index = function(req, res){
    res.render('index', {
        title: 			'Alibaba 拉丁培训',
        cCourse: 		cCourse,
        showDancerLink: false
    });
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
 * 初始化测试数据，该代码上线后应当被移除. eg:http://localhost:3000/init/initdata
 */
exports.initdata = function(req, res){
	var dancerModel;
	for (var i = 60; i >= 10; i--) {

		var insertDancer = function(i){
			dancerModel = {
				dancerID: 	'299' + i,
				courseA: 	(i%3+1) + 'RB',
				courseB: 	(i%3+1) + 'CM',
				dancerName: 'M.J.' + i,
				gender: 	i%3 >= 2? 'male':'female',
				email: 		'hustcer' + i + '@alibaba-inc.com',
				wangWang: 	'hustcer' + i,
				extNumber: 	'599' + i,
				alipayID: 	'hustcer' + i + '@gmail.com',
				department: i%2 === 0? 'tech':'other'
			};

			db.latin.insertDancer(dancerModel, function(err, addResult) {
			    if (err) throw err;

			    if (addResult) {
				    console.log(dancerModel.dancerName + ' Added!');
			    }
			});

		};
		insertDancer(i);

	};
	
	res.send({data:null});
};

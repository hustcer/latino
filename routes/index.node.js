/**
 * Dancer index 
 *
 * Author: 	hustcer
 * Date: 	2012-1-19   
 */

var getCollection 	= require("./util.node.js").getCollection;

/*
 * GET home page.
 */
exports.index = function(req, res){
	var col 	= getCollection(req);
	var dType 	= req.params.dType;

	if( dType != 'latin' && dType != 'jazz' & dType != 'hiphop'){
		res.redirect('/err404');
        return;
	}

	res.render('index', {
        title: 			'Alibaba 舞蹈培训',
        cCourse: 		col.cCourse,
        showDancerLink: false
    });
    
};

/*
 * 会员注册、报名课程、更新个人信息.注意：课程只能报名添加不能随意删除。
 */
exports.apply = function(req, res){

	var col = getCollection(req), cCourse = col.cCourse;

	// 邮箱不需要加后缀的，如果用户加了就统一去掉吧，没加也无妨
	if (!!req.body.email) { req.body.email = req.body.email.replace(/@alibaba-inc.com/g, ""); };

	var cCourseLength = +req.body.courseLen, 
		courseArray	  = [];

	var dancerModel   = {
		dancerID: 	req.body.dancerID,
		dancerName: req.body.dancerName,
		gender: 	req.body.gender,
		email: 		req.body.email + '@alibaba-inc.com',
		wangWang: 	req.body.wangWang,
		extNumber: 	req.body.extNumber,
		alipayID: 	req.body.alipayID,
		department: req.body.department
	};

	for (var i = 0, l = cCourseLength; i < l; i ++) {
		courseArray.push(req.body['course' + i]);
	};

	dancerModel.courseArray	= courseArray;

	col.findDancerByID( dancerModel.dancerID, function(err, result) {
	    if (err) throw err;
	    
	    // 之所以要把新插入会员和更新会员信息分开处理而不采用upsert模式，
	    // 一方面是要设置会员创建时间，另一方面是为了明确操作逻辑，避免意外
	    // 会员存在则更新会员信息
	    if (!!result) {
	    	col.updateDancerByID(dancerModel.dancerID, dancerModel, function(err) {
	    		if (err) throw err;

    			// 如果开启课程自动审核则在这里进行自动审核
    			if(cCourse.autoApprove){
    				col.autoApprove(dancerModel);
    			}
	    	});
			
		// 会员不存在则插入会员信息
	    }else{
	    	col.insertDancer(dancerModel, function(err, addResult) {
			    if (err) throw err;

			    if (!!addResult) {

				    // 如果开启课程自动审核则在这里进行自动审核
	    			if(cCourse.autoApprove){
	    				// 新插入会员的时候会把dancerModel 的courseArray属性删除掉，而课程自动审核需要该属性
	    				dancerModel.courseArray	= courseArray;
	    				col.autoApprove(dancerModel);
	    			}
			    }
			});
	    }

	    // 表单提交成功后返回首页
	    // res.redirect('back');
		res.render('index', {
	        title: 			'Alibaba 舞蹈培训',
	        cCourse: 		cCourse,
	        showDancerLink: true,
	        dancerID: 		dancerModel.dancerID
	    });

	});
    
};

/*
 * 查询会员信息. eg:http://localhost:3000/queryDancer/latin/29411
 */
exports.queryDancer = function(req, res){
	var col = getCollection(req);

	col.findDancerByID(req.params.id, function(err, result) {
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
 * 查询当前开课课程报名统计信息. eg:http://localhost:3000/queryCourseInfo/latin
 */
exports.queryCourseInfo = function(req, res){
	var col = getCollection(req), cCourse = col.cCourse;
	var courseInfoList = [], counter = 0;
	
	for (var i = 0, l = cCourse.courses.length; i < l; i ++) {

		(function(){
			// NOTICE: courseInfo不能放在for循环外面定义，否则三个异步查询的回调都会修改同一个courseInfo引用，造成前面查询的结果被覆盖
			var courseVal = cCourse.courses[i].cValue, courseInfo = {}, 
				// 申请退课但尚未审核批准的也算报名成功的
				cond1 	  = { courses:{$elemMatch: {'courseVal':courseVal,'status':'waiting'}}  },
				cond2 	  = { courses:{$elemMatch: {'courseVal':courseVal,'status':{$in: ['approved', 'quitApplied']} }} };

			col.countDancerByCondition(cond1, function(err, count){
				if (err) throw err;
				courseInfo.total = count;

				col.countDancerByCondition(cond2, function(err, count){
						if (err) throw err;
						courseInfo.approved  = count;
						courseInfo.total 	+= count;
						// NOTICE: 由于是异步并行执行push不一定能保证顺序，最好还是严格根据数组索引赋值 ???
						courseInfoList.push(courseInfo);
						// courseInfoList[i] 	 = courseInfo;
						// console.log(courseInfoList);
						// 如果所有需要的课程信息已经查询完毕则返回
						if(++counter == l){
							res.send( {courseInfo:courseInfoList} );
						}
				});

			});

		})(i, l);

	};

	// WARN: 如果在此处返回则 courseInfoList 中的数据可能为空，因为循环很快执行完毕，而循环体内的代码是异步执行的，不会阻塞执行。
	// res.send( {courseInfo:courseInfoList} );

}

/*
 * 查询会员信息. eg:http://localhost:3000/quitCourse/latin/29411?courseVal=13CB
 */
exports.quitCourse = function(req, res){
	var col = getCollection(req);

	console.log("Applying Course Quiting With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	col.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'quitApplied', function(err) {
	    if (err) throw err;

	    res.contentType('application/json');
	    res.send({success:true});
	    
	});

};

/*
 * 会员取消课程报名. eg:http://localhost:3000/cancelCourse/latin/29411?courseVal=13CB
 */
exports.cancelCourse = function(req, res){

	var col = getCollection(req);

	console.log("Course Cancel With dancerID: "+ req.params.id + " courseVal: " + req.query.courseVal)

	col.updateDancerCourseStatus(req.params.id, req.query.courseVal, 'cancelled', function(err) {
	    if (err) throw err;
	    res.contentType('application/json');
	    res.send({success:true});
	    
	});

};

/*
 * 初始化测试数据，该代码上线后应当被移除. eg:http://localhost:3000/init/initdata/latin
 */
exports.initdata = function(req, res){

	var col = getCollection(req);

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
				department: Math.random() >= 0.5 ? 'tech':'other',
				vip: 		Math.ceil(Math.random()*5), 
				level: 		Math.ceil(Math.random()*9)	
			};

			col.insertDancer(dancerModel, function(err, addResult) {
			    if (err) throw err;

			    if (addResult) {
				    console.log('index.node.js: [INFO]---',dancerModel.dancerName + ' Added!');
			    }
			});

		};
		insertDancer(i);

	};
	
	res.send({success:true});
};


/**
 * 会员Collection 常规操作绑定方法
 */
var commonDancerOp = exports.commonDancerOp = {

	/**
	 * 插入新会员
	 * @param dancerModel 	待插入的会员信息
	 */
	insertDancer: function(dancerModel, fn) {
		console.log("You called latin binding method: insertDancer!");
		console.info("New courses: A--" + dancerModel.courseA + " B--" + dancerModel.courseB);

		var courseAddArray = [];
		if( !!dancerModel.courseA ) {
			// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
			courseAddArray.push({courseVal:dancerModel.courseA,status:'waiting',paid:false});
		}
		if( !!dancerModel.courseB ) {
			// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
			courseAddArray.push({courseVal:dancerModel.courseB,status:'waiting',paid:false});
		}

		delete dancerModel.courseA;
		delete dancerModel.courseB;
		dancerModel.courses = courseAddArray;
		dancerModel.gmtCreated = new Date();
		dancerModel.gmtModified = new Date();

		this.insert(dancerModel, fn);
	},
	/**
	 * 更新会员dancerID的相关信息
	 * @param dancerID 		待更新的会员的dancerID
	 * @param dancerModel 	待更新的会员信息, 该model为前台用户提交的表单信息里面的数据
	 * TODO:$addToSet 该方式报名有问题，会产生重复的课程却处于不同的状态
	 */
	updateDancerByID: function(dancerID, dancerModel, fn){
		console.log("You called latin binding method: updateDancerByID!");
		console.info("Update courses: A--" + dancerModel.courseA + " B--" + dancerModel.courseB);

		var courseAddArray = [];
		if( !!dancerModel.courseA ) {
			// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
			courseAddArray.push({courseVal:dancerModel.courseA,status:'waiting',paid:false});
		}
		if( !!dancerModel.courseB ) {
			// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
			courseAddArray.push({courseVal:dancerModel.courseB,status:'waiting',paid:false});
		}

		console.info(courseAddArray);

		this.update({'dancerID':dancerID}, { $set:{
			'dancerName': 	dancerModel.dancerName,
			'extNumber' : 	dancerModel.extNumber,
			'email': 		dancerModel.email,
			'wangWang': 	dancerModel.wangWang,
			'gender': 		dancerModel.gender,
			'alipayID': 	dancerModel.alipayID,
			'department': 	dancerModel.department,
			'gmtModified': 	new Date()

		}, $addToSet:{
			'courses':{$each: courseAddArray}	
		}	}, fn);
		
	},
	/**
	 * 根据条件查询其基本会员信息，不含创建，修改时间，_id等
	 * @param condition 	Json对象，待查询的会员所满足的条件
	 *						eg. {dancerID:'29411', courses:'13R', payStatus.L1C:true}
	 */
	findDancerByCondition: function(condition, fn){
		this.find(condition, {gmtCreated:0, gmtModified:0, _id:0}).toArray(fn);
	},
	/**
	 * 查询满足指定条件的会员数目
	 * @param condition 	Json对象，待查询的会员所满足的条件
	 *						eg. {dancerID:'29411', 'courses.courseVal':'13R', 'courses.paid':true}
	 */
	countDancerByCondition: function(condition, fn){
		this.count(condition, fn);
	},
	/**
	 * 根据dancerID查询其基本会员信息，不含创建，修改时间，_id等
	 * @param dancerID 		待查询的会员的dancerID
	 */
	findDancerByID: function(dancerID, fn){
		this.findOne({'dancerID':dancerID}, {gmtCreated:0, gmtModified:0, _id:0}, fn);
	},
	/**
	 * 根据dancerID查询其全部保存在数据库里的会员信息
	 * @param dancerID 		待查询的会员的dancerID
	 */
	findFullDancerInfoByID: function(dancerID, fn){
		this.findOne({'dancerID':dancerID}, fn);
	},
	/**
	 * 删除dancerID及其对应的所有信息
	 * @param dancerID 		待删除的会员的dancerID
	 */
	deleteDancerByID: function(dancerID, fn){
		this.remove({'dancerID':dancerID}, fn);
	},
	/**
	 * 设置会员缴费状态
	 * @param dancerID 		待设置的会员的dancerID
	 * @param courseValue 	待设置的课程的值
	 * @param isPaid 		会员是否缴费，缴费为true，反之为false
	 */
	updateDancerPayStatus: function(dancerID, courseValue, isPaid, fn){

		this.update({'dancerID':dancerID, 'courses.courseVal':courseValue}, {  $set:
			{'courses.$.paid':isPaid, 'gmtModified': new Date()}

		}, fn);
	},
	/**
	 * 设置会员课程状态
	 * @param dancerID 		待设置的会员的dancerID
	 * @param courseValue 	待设置的课程的值
	 * @param status 		目前可能的状态有：
	 *						waiting: 	会员刚申请报名，待审核；
	 * 						approved: 	管理员审核通过，会员报名成功；
	 *						refused: 	管理员审核不通过，会员报名失败；
	 *						quitApplied:会员申请退课，等待管理员审批；
	 *						quit: 		管理员确定会员退课，并且将其费用退还；
	 */
	updateDancerCourseStatus: function(dancerID, courseValue, status, fn){

		this.update({'dancerID':dancerID, 'courses.courseVal':courseValue}, {  $set:
			{'courses.$.status':status, 'gmtModified': new Date()}

		}, fn);
	}
	
};


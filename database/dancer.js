

/**
 * 会员Collection 常规操作绑定方法
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author: 	justin.maj
 * Date: 	2012-1-20  
 */
 
var commonDancerOp = exports.commonDancerOp = {

	/**
	 * 插入新会员
	 * @param dancerModel 	待插入的会员信息
	 */
	insertDancer: function(dancerModel, fn) {

		var courseAddArray = [], logMsg = '';
		if( !!dancerModel.courseA ) {
			// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
			courseAddArray.push({courseVal:dancerModel.courseA, status:'waiting',
				gmtStatusChanged: new Date(), paid:false});

			logMsg += 'A--' + dancerModel.courseA;
		}
		if( !!dancerModel.courseB ) {
			// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
			courseAddArray.push({courseVal:dancerModel.courseB, status:'waiting',
				gmtStatusChanged: new Date(), paid:false});

			logMsg += ' B--' + dancerModel.courseB;
		}

		if(!!logMsg){
			console.info("Add New Courses:", logMsg, 'for Member: ', dancerModel.dancerID);
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
	 * ATTENTION:$addToSet 方式报名有问题，会产生重复的课程却处于不同的状态
	 */
	updateDancerByID: function(dancerID, dancerModel, fn){

		var courseAddArray = [], self = this, logMsg = '';

		if( !!dancerModel.courseA ) {
			courseAddArray.push( dancerModel.courseA );
			logMsg += 'A--' + dancerModel.courseA;
		}

		if( !!dancerModel.courseB ) {
			courseAddArray.push( dancerModel.courseB );
			logMsg += ' B--' + dancerModel.courseB;
		}

		if(!!logMsg){
			console.info("Update Courses:", logMsg, 'for Member: ', dancerID);
		}

		this.findOne({'dancerID':dancerID}, function(err, result) {

		    if (err) {
		    	console.log('Find Dancer Failed While Updating Dancer Info!');
		    	throw err;
			}

			result.dancerName = dancerModel.dancerName;
			result.extNumber = dancerModel.extNumber;
			result.email = dancerModel.email;
			result.wangWang = dancerModel.wangWang;
			result.gender = dancerModel.gender;
			result.alipayID = dancerModel.alipayID;
			result.department = dancerModel.department;

			for (var exist, j = courseAddArray.length - 1; j >= 0; j--) {
				exist = false;
				// 找到则更新相应课程
				for (var i = result.courses.length - 1; i >= 0; i--) {
				
					if (result.courses[i].courseVal === courseAddArray[j]) {
						result.courses[i].status = 'waiting';
						result.courses[i].gmtStatusChanged = new Date();
						exist = true;
						break;
					};
				};  // end inner for loop
				// 未找到则插入数据
				if ( !exist ) {
					// 新插入数据库的学员如果报名课程的话将其报名状态设为 waiting，待审核,且未付款
					result.courses.push( { courseVal:courseAddArray[j], status:'waiting',
										gmtStatusChanged:new Date(), paid:false } );
				};
			};

			result.gmtModified = new Date();
			self.save(result, fn);

		});
		
	},
	/**
	 * 根据条件查询其基本会员信息，不含创建，修改时间，_id等
	 * @param condition 	Json对象，待查询的会员所满足的条件
	 *						eg. {dancerID:'29411', 'courses.courseVal':'13R', 'courses.paid':true}
	 */
	findDancerByCondition: function(condition, fn){
		this.find(condition, {gmtCreated:0, gmtModified:0, _id:0}).toArray(fn);
	},
	/**
	 * 查询满足指定条件的会员数目
	 * @param condition 	Json对象，待查询的会员所满足的条件
	 *						eg. {dancerID:'29411', 'courses.courseVal':'13R', 'courses.paid':true}
	 *		eg. 查询某个课程申请报名人数 { 'courses.courseVal':'13RE', 'courses.status':'waiting'}
	 *		eg. 查询某个课程报名成功人数 { 'courses.courseVal':'13RE', 'courses.status':'approved'}
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
			{'courses.$.paid':isPaid, 'courses.$.gmtPayChanged':new Date(), 'gmtModified': new Date()}

		}, fn);
	},
	/**
	 * 设置会员课程状态
	 * @param dancerID 		待设置的会员的dancerID
	 * @param courseValue 	待设置的课程的值
	 * @param status 		目前可能的状态有：
	 *						waiting: 	会员刚申请报名，待审核；
	 *						cancelled: 	用户先申请报名，然后未及管理员审核就取消报名
	 * 						approved: 	管理员审核通过，会员报名成功；
	 *						refused: 	管理员审核不通过，会员报名失败；
	 *						quitApplied:会员申请退课，等待管理员审批；
	 *						quit: 		管理员确定会员退课，并且将其费用退还；
	 */
	updateDancerCourseStatus: function(dancerID, courseValue, status, fn){

		this.update({'dancerID':dancerID, 'courses.courseVal':courseValue}, {  $set:
			{'courses.$.status':status, 'courses.$.gmtStatusChanged':new Date(), 'gmtModified': new Date()}

		}, fn);
	}
	
};


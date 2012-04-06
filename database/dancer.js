

/**
 * 会员Collection 常规操作绑定方法
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author: 	justin.maj
 * Date: 	2012-1-20  
 */

// 注意：将collection与方法绑定是在app.js里进行的，此处在内部调用的时候绑定尚未发生，所以需要引入db
var db 			= require("../database/database.js").db;
// 当前开课信息
var cCourse 	= require("../database/course.js").currentCourse;
var Step 		= require('step');

var CDO = exports.commonDancerOp = {

	/**
	 * 插入新会员
	 * @param dancerModel 	待插入的会员信息
	 */
	insertDancer: function(dancerModel, fn) {
		// 新报名课程默认状态为 'waiting'
		var courseAddArray = [], logMsg = '', courseStatus = 'waiting';

		if( !!dancerModel.courseA ) {
			
			// 新插入数据库的学员如果报名课程的话根据规则设置报名状态,且未付款
			courseAddArray.push({courseVal:dancerModel.courseA, status:courseStatus,
				gmtStatusChanged: new Date(), paid:false});

			logMsg += 'A--' + dancerModel.courseA;
		}
		if( !!dancerModel.courseB ) {
			
			// 新插入数据库的学员如果报名课程的话根据规则设置报名状态,且未付款
			courseAddArray.push({courseVal:dancerModel.courseB, status:courseStatus,
				gmtStatusChanged: new Date(), paid:false});

			logMsg += ' B--' + dancerModel.courseB;
		}

		if(!!logMsg){
			console.info("Add New Courses:", logMsg, 'for Member: ', dancerModel.dancerID);
		}

		delete dancerModel.courseA;
		delete dancerModel.courseB;
		dancerModel.courses 	= courseAddArray;
		dancerModel.gmtCreated 	= new Date();
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

		// 新报名课程默认状态为 'waiting'
		var courseAddArray = [], self = this, logMsg = '', courseStatus = 'waiting';

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
			// 性别一旦确定则不能修改
			// result.gender = dancerModel.gender;
			result.alipayID = dancerModel.alipayID;
			result.department = dancerModel.department;

			for (var exist, j = courseAddArray.length - 1; j >= 0; j--) {
				exist = false;
				// 找到则更新相应课程，比如之前报过名的后来状态又变更为quit或者refused的课程
				for (var i = result.courses.length - 1; i >= 0; i--) {
				
					if (result.courses[i].courseVal === courseAddArray[j]) {

						result.courses[i].status = courseStatus;
						result.courses[i].gmtStatusChanged = new Date();
						exist = true;
						break;
					};
				};  // end inner for loop
				// 未找到则插入数据
				if ( !exist ) {
					// 新插入数据库的课程根据规则设置报名状态,且未付款
					result.courses.push( { courseVal:courseAddArray[j], status:courseStatus,
										gmtStatusChanged:new Date(), paid:false } );
				};
			};

			result.gmtModified = new Date();
			self.save(result, fn);

		});
		
	},
	/**
	 * 取得会员报名课程初始化状态
	 * @param dancerModel 	待设置课程报名状态的会员信息, 该model为前台用户提交的表单信息里面的数据
	 * @param courseVal 	待设置课程报名状态课程
	 */
	_getCourseInitStatus: function(dancerModel, courseVal){
		var courseStatus = 'waiting';
		// console.log('CDO._isAutoApprovable(dancerModel, courseVal):', CDO._isAutoApprovable(dancerModel, courseVal));
		if(cCourse.autoApprove && CDO._isAutoApprovable(dancerModel, courseVal)){

			courseStatus = 'approved';
		}
		return courseStatus;
	},
	/**
	 * 根据一定的判断原则决定该会员初始报名的时候是否可以自动被审核通过
	 * 判断原则如下：
	 * 0. 当前课程报名成功人数小于autoLimit，则返回true
	 * 1. 男生且当前课程报名成功人数小于班级限额则返回true
	 * 2. 女生，如果level >= 3，或者vip >= 3 且当前报名成功人数小于(班级限额-3)则返回true
	 * 3. 其他情况返回 false
	 * 4. 其他规则后续补充
	 * @param dancerModel 	待判断是否可以自动审核通过的会员信息, 该model为前台用户提交的表单信息里面的数据
	 * @param courseVal 	待设置课程报名状态课程
	 */
	_isAutoApprovable: function(dancerModel, courseVal){

	    if(dancerModel.gender === 'male'){
            return true;
       	}
      	return false;

		var condition = {courses:{	$elemMatch:
							{'courseVal': 	courseVal,
							 'status': 		{$in: ['approved', 'quitApplied']}
							}
						 }};

		/**
		// 注意：将collection与方法绑定是在app.js里进行的，此处在内部调用的时候绑定尚未发生
		// 所以需要调用db的方法
		db.latin.count(condition, function(err, count){

			console.log('currentCount:', count, ' ,currentLimit:', cCourse.autoLimit);

			// -------------------Rule NO.1-----------------------------------
			// 如果当前报名成功的会员数目小于允许的自动审核限额则自动审核通过
			if( count <= cCourse.autoLimit ){
				return true;
			}
			
			if( count < cCourse.cCapacity ){

			// -------------------Rule NO.2-----------------------------------
				// 如果该舞种报名男士优先则直接审核通过
				if (dancerModel.gender === 'male' && cCourse.manFirst) {return true;};

			// -------------------Rule NO.3-----------------------------------
				CDO.findDancerByID(dancerModel.dancerID, function(err, result){
					if (err) {throw err};
					if (!!result) {
						if ( result.level >= 3 || result.vip >= 3 ) {
							return true;
						};
					};

				})

			} // end if count < cCourse.cCapacity

			return false;

		});*/


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

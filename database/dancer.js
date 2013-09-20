

/**
 * 会员Collection 常规操作绑定方法
 * Ref：http://www.hacksparrow.com/mongoskin-tutorial-with-examples.html
 *
 * Author:  hustcer
 * Date:    2012-1-20  
 */
var sendMail        = require("../routes/mail.node.js").sendMail;

exports.commonDancerOp = {

    /**
     * 插入新会员
     * @param dancerModel   待插入的会员信息
     */
    insertDancer: function(dancerModel, fn) {
        // 新报名课程默认状态为 'waiting'
        var courseAddArray = [], logMsg = '', courseStatus = 'waiting';

        if( !!dancerModel.courseArray ) {
            
            for(var i = 0, l = dancerModel.courseArray.length; i < l; i ++){
                if( !!dancerModel.courseArray[i] ) {
                    // 新插入数据库的学员如果报名课程的话根据规则设置报名状态,且未付款
                    courseAddArray.push({courseVal:dancerModel.courseArray[i], status:courseStatus,
                        gmtStatusChanged: new Date(), applyTime: new Date(), paid:false});

                    logMsg += i + '--' + dancerModel.courseArray[i] + '; ';
                }
            }
        }

        delete dancerModel.courseArray;
        dancerModel.vip         = 0;    // lte 5
        dancerModel.level       = 1;    // lte 9
        dancerModel.locked      = false;
        dancerModel.courses     = courseAddArray;
        // 工号里面的小写统一转换成大写
        dancerModel.dancerID    = dancerModel.dancerID.toUpperCase();
        dancerModel.gmtCreated  = new Date();
        dancerModel.gmtModified = new Date();

        this.insert(dancerModel, fn);
        console.info('[INFO]----New dancer added, with dancerID:', dancerModel.dancerID, 
            ', DancerName:', dancerModel.dancerName, ", Courses:", (logMsg ? logMsg: 'NONE') );
    },
    /**
     * 更新会员dancerID的相关信息
     * @param dancerID      待更新的会员的dancerID
     * @param dancerModel   待更新的会员信息, 该model为前台用户提交的表单信息里面的数据
     * ATTENTION:$addToSet 方式报名有问题，会产生重复的课程却处于不同的状态
     */
    updateDancerByID: function(dancerID, dancerModel, fn){
        dancerModel.dancerID = dancerID = dancerID.toUpperCase();

        // 新报名课程默认状态为 'waiting'
        var courseAddArray = [], self = this, logMsg = '', courseStatus = 'waiting';

        if( !!dancerModel.courseArray ) {
            
            for(var i = 0, l = dancerModel.courseArray.length; i < l; i ++){
                if( !!dancerModel.courseArray[i] ) {
                    courseAddArray.push( dancerModel.courseArray[i] );
                    logMsg += i + '--' + dancerModel.courseArray[i] + '; ';
                }
            }
        }

        this.findOne({'dancerID':dancerID}, function(err, result) {

            if (err) {
                console.error('[ERRO]----Find dancer failed while updating dancer info of dancerID', dancerID);
                throw err;
            }

            result.dancerName   = dancerModel.dancerName;
            result.extNumber    = dancerModel.extNumber;
            result.email        = dancerModel.email;
            result.wangWang     = dancerModel.wangWang;
            // 性别一旦确定则不能修改
            // result.gender    = dancerModel.gender;
            result.alipayID     = dancerModel.alipayID;
            result.department   = dancerModel.department;

            for (var exist, j = courseAddArray.length - 1; j >= 0; j--) {
                exist = false;
                // 找到则更新相应课程，比如之前报过名的后来状态又变更为quit或者refused的课程
                for (var i = result.courses.length - 1; i >= 0; i--) {
                
                    if (result.courses[i].courseVal === courseAddArray[j]) {

                        result.courses[i].status            = courseStatus;
                        result.courses[i].applyTime         = new Date();
                        result.courses[i].gmtStatusChanged  = new Date();
                        exist = true;
                        break;
                    };
                };  // end inner for loop
                // 未找到则插入数据
                if ( !exist ) {
                    // 新插入数据库的课程根据规则设置报名状态,且未付款
                    result.courses.push( {  courseVal:          courseAddArray[j], 
                                            status:             courseStatus,
                                            gmtStatusChanged:   new Date(), 
                                            applyTime:          new Date(), 
                                            paid:               false 
                                        } );
                };
            };

            result.gmtModified = new Date();
            self.save(result, fn);

            console.info('[INFO]----Dancer infomation updated with ID:', dancerModel.dancerID,
                            ', DancerName:', dancerModel.dancerName, ", Updated courses:", (logMsg ? logMsg: 'NONE') );

        });
        
    },
    /**
     * Admin更新会员dancerID的相关信息
     * @param dancerID      待更新的会员的dancerID
     * @param dancerModel   待更新的会员信息, 该model为前台用户提交的表单信息里面的数据
     */
    updateDancerByAdmin: function(dancerID, dancerModel, fn){
        dancerModel.dancerID = dancerID = dancerID.toUpperCase();

        var self = this;

        this.findOne({'dancerID':dancerID}, function(err, result) {

            if (err) {
                console.error('[ERRO]----Find dancer failed while updating dancer info of dancerID', dancerID);
                throw err;
            }

            result.dancerName   = dancerModel.dancerName;
            result.extNumber    = dancerModel.extNumber;
            result.email        = dancerModel.email;
            result.wangWang     = dancerModel.wangWang;
            // 性别管理员还是可以修改的哈
            result.gender       = dancerModel.gender;
            result.alipayID     = dancerModel.alipayID;
            result.department   = dancerModel.department;
            // + 会自动将字符串转换成数字
            if(!!dancerModel.vip)   result.vip      = +dancerModel.vip;
            if(!!dancerModel.level) result.level    = +dancerModel.level;
            if(!!dancerModel.forever){
                result.forever = true;
            } else{
                result.forever = false;
            }

            // 管理员修改用户信息不用更新修改时间状态
            // result.gmtModified = new Date();
            self.save(result, fn);

            console.info('[INFO]----Dancer information was updated by admin, ID:', dancerModel.dancerID,
                            ', DancerName:', dancerModel.dancerName, ', at', new Date() );

        });
        
    },
    /**
     * 根据一定的判断原则决定该会员初始报名的时候是否可以自动被审核通过
     * @param dancerModel   待判断是否可以自动审核通过的会员信息, 该model为前台用户提交的表单信息里面的数据
     */
    autoApprove: function(dancerModel){

        if( !!dancerModel.courseArray ) {
            
            for(var i = 0, l = dancerModel.courseArray.length; i < l; i ++){
                if( !!dancerModel.courseArray[i] ) {

                    this._approveCourse( dancerModel, dancerModel.courseArray[i] );
                }
            }
        }
    },
    /**
     * 根据一定的判断原则决定该会员初始报名的时候是否可以自动被审核通过
     * 判断原则如下：
     * 0. 当前课程报名成功人数小于autoLimit，则自动审核通过
     * 1. 男生且当前课程报名成功人数小于班级限额则自动审核通过
     * 2. 女生，如果level >= 3，或者vip >= 2 且当前报名成功人数小于(班级限额-3)则自动审核通过
     * 3. 其他情况不会修改课程审核状态
     * 4. 其他规则后续补充
     * @param dancerModel   待判断是否可以自动审核通过的会员
     * @param courseVal     待自动审核的课程
     */
    _approveCourse: function(dancerModel, courseVal){
        console.info('[INFO]----Try to auto approve dancer:', dancerModel.dancerID, ' CourseVal:', courseVal);
        dancerModel.dancerID = dancerModel.dancerID.toUpperCase();

        var autoApprove = this._getPropValue(courseVal, 'autoApprove'),
            cCapacity   = this._getPropValue(courseVal, 'cCapacity'),
            manFirst    = this._getPropValue(courseVal, 'manFirst'),
            autoLimit   = this._getPropValue(courseVal, 'autoLimit');

        var condition = {courses:{  $elemMatch:
                            {'courseVal':   courseVal,
                             'status':      {$in: ['approved', 'quitApplied']}
                            }
                         }};
        var self = this;

        // 此处内部调用时还没有绑定方法所以要调用原生db
        this.count(condition, function(err, count){
            // console.log("Success Count:",count,' autoLimit:', autoLimit, ' cCapacity:', cCapacity);
            // -------------------Rule NO.1-----------------------------------
            // 如果当前报名成功的会员数目小于允许的自动审核限额则自动审核通过
            if( count < autoLimit ){
                console.info('[INFO]----Auto approved according to rule NO.1: dancerID-', dancerModel.dancerID, 
                    ', DancerName-', dancerModel.dancerName, ', Course-', courseVal);
                self.updateDancerCourseStatus(dancerModel.dancerID, courseVal, 'approved', function(){

                    self.findDancerEmailByID(dancerModel.dancerID, function(err, dancer){
                        if (err) throw err;
                        sendMail(dancer.email, '您的报名申请已自动审核通过', self.cCourse.successMsg + '课程代码：' + courseVal);
                    });

                });
                // 每条自动审核规则执行完后都要return，否则会继续执行下面的规则，下同。
                return;
            }
            
            // 如果当前报名成功的会员数目小于课程总容量则继续下面的审核规则，否则不再继续审核
            if( count < cCapacity ){

                self.findDancerByID(dancerModel.dancerID, function(err, result){
                    if (err) {throw err};

                    // -------------------Rule NO.2-----------------------------------
                    // 如果该舞种报名男士优先则直接审核通过
                    if ( !!result && result.gender === 'male' && manFirst ) {
                        console.info('[INFO]----Auto approved according to rule NO.2: dancerID-', dancerModel.dancerID, 
                            ', DancerName-', dancerModel.dancerName, ', Course-', courseVal);

                        self.updateDancerCourseStatus(dancerModel.dancerID, courseVal, 'approved', function(){

                            sendMail(result.email, '您的报名申请已自动审核通过', self.cCourse.successMsg + '课程代码：' + courseVal);

                        });

                        return;
                    };

                    // -------------------Rule NO.3-----------------------------------
                    if ( !!result && ( result.level >= 3 || result.vip >= 2 || result.forever ) ) {

                        console.info('[INFO]----Auto approved according to rule NO.3: dancerID-', dancerModel.dancerID, 
                            ', DancerName-', dancerModel.dancerName, ', Course-', courseVal);

                        self.updateDancerCourseStatus(dancerModel.dancerID, courseVal, 'approved', function(){

                            sendMail(result.email, '您的报名申请已自动审核通过', self.cCourse.successMsg + '课程代码：' + courseVal);

                        });

                        return;
                    };

                })

            } // end if count < cCapacity
            return;
        });
    },
    /**
     * 取得courseVal 相应属性的有效 value，局部 value 可以覆盖全局 value
     * @param courseVal     需要查询的课程值
     * @param propName      需要获得其值的属性名          
     */
    _getPropValue: function(courseVal, propName){

        for (var i = this.cCourse.courses.length - 1, courseItem; i >= 0; i--) {
            courseItem = this.cCourse.courses[i];

            if(courseItem.cValue === courseVal){
                if( courseItem.hasOwnProperty(propName) ){
                    return courseItem[propName];
                }else{
                    return this.cCourse[propName];
                }
            }
        };
    },
    /**
     * 根据条件查询其基本会员信息，不含创建，修改时间，_id等
     * @param condition     Json对象，待查询的会员所满足的条件
     *                      eg. {dancerID:'29411', 'courses.courseVal':'13R', 'courses.paid':true}
     */
    findDancerByCondition: function(condition, fn){
        if (!!condition.dancerID) { condition.dancerID = condition.dancerID.toUpperCase();};
        this.find(condition, {gmtCreated:0, gmtModified:0, _id:0}).toArray(fn);
    },
    /**
     * 查询满足指定条件的会员数目
     * @param condition     Json对象，待查询的会员所满足的条件
     *                      eg. {dancerID:'29411', 'courses.courseVal':'13R', 'courses.paid':true}
     *      eg. 查询某个课程申请报名人数 { 'courses.courseVal':'13RE', 'courses.status':'waiting'}
     *      eg. 查询某个课程报名成功人数 { 'courses.courseVal':'13RE', 'courses.status':'approved'}
     */
    countDancerByCondition: function(condition, fn){
        if (!!condition.dancerID) { condition.dancerID = condition.dancerID.toUpperCase();};
        this.count(condition, fn);
    },
    /**
     * 根据dancerID查询其基本会员信息，不含创建，修改时间，_id等
     * @param dancerID      待查询的会员的dancerID
     */
    findDancerByID: function(dancerID, fn){
        this.findOne({'dancerID':dancerID.toUpperCase()}, {gmtCreated:0, gmtModified:0, _id:0, vip:0, level:0}, fn);
    },
    /**
     * 根据dancerID查询会员email地址
     * @param dancerID      待查询的会员的dancerID
     */
    findDancerEmailByID: function(dancerID, fn){
        this.findOne({'dancerID':dancerID.toUpperCase()}, {email:1, _id:0}, fn);
    },
    /**
     * 根据dancerID查询其全部保存在数据库里的会员信息
     * @param dancerID      待查询的会员的dancerID
     */
    findFullDancerInfoByID: function(dancerID, fn){
        this.findOne({'dancerID':dancerID.toUpperCase()}, fn);
    },
    /**
     * 删除dancerID及其对应的所有信息
     * @param dancerID      待删除的会员的dancerID
     */
    deleteDancerByID: function(dancerID, fn){
        this.remove({'dancerID':dancerID.toUpperCase()}, fn);
    },
    /**
     * 设置会员缴费状态
     * @param dancerID      待设置的会员的dancerID
     * @param courseValue   待设置的课程的值
     * @param isPaid        会员是否缴费，缴费为true，反之为false
     */
    updateDancerPayStatus: function(dancerID, courseValue, isPaid, fn){

        this.update({'dancerID':dancerID.toUpperCase(), 'courses.courseVal':courseValue}, {  $set:
            {'courses.$.paid':isPaid, 'courses.$.gmtPayChanged':new Date(), 'gmtModified': new Date()}

        }, fn);
    },
    /**
     * 设置会员课程状态
     * @param dancerID      待设置的会员的dancerID
     * @param courseValue   待设置的课程的值
     * @param status        课程新的状态。目前可能的状态有：
     *                      waiting:    会员刚申请报名，待审核；
     *                      cancelled:  用户先申请报名，然后未及管理员审核就取消报名
     *                      approved:   管理员审核通过，会员报名成功；
     *                      refused:    管理员审核不通过，会员报名失败；
     *                      quitApplied:会员申请退课，等待管理员审批；
     *                      quit:       管理员确定会员退课，并且将其费用退还；
     */
    updateDancerCourseStatus: function(dancerID, courseValue, status, fn){

        this.update({'dancerID':dancerID.toUpperCase(), 'courses.courseVal':courseValue}, {  $set:
            {'courses.$.status':status, 'courses.$.gmtStatusChanged':new Date(), 'gmtModified': new Date()}

        }, fn);
    }
    
};


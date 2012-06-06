
/**
 * 培训课程信息
 *
 * Author: 	hustcer
 * Date: 	2012-1-19  
 */

/**
 * 当前开课情况:Latin
 */
var cCourseLatin = {
	// **************	不同的舞种数据存储在不同的Collecion里面的，一定不能混存。	*************
	// **************	拉丁数据存储在dance数据库中的	latin  collecion中 	  	*************
	// **************	爵士数据存储在dance数据库中的	jazz   collecion中 		*************
	// **************	街舞数据存储在dance数据库中的	hiphop collecion中 		*************
	courseType: 'latin',
	// 每个课程可以有：cCapacity、locked、autoApprove、manFirst、autoLimit等局部配置，可以覆盖相应的全局配置
	courses: 	[{cValue: "13SE", cName: "第13期桑巴基础班", ps:"上课时间：每周四晚6:30~7:30",locked: false},
	 			 {cValue: "13CI", cName: "第13期恰恰中级班", ps:"上课时间：每周四晚7:40~8:40",locked: false}],
	// 课程额定容量，此为全局配置可以被各课程的对应配置所覆盖
	cCapacity: 	21, 
	// 锁定课程状态，禁止报名、退课等操作
	locked: 	false,
	// 是否开启报名自动审核
	autoApprove:true,
	// 是否男士报名优先，对于拉丁课男士优先则自动审核开启时男士报名自动审核通过
	manFirst: 	true,
	// 自动审核报名成功的人数限制
	autoLimit: 	18,
    notice: 	'上课地点:公司舞房.每个培训舞种共12次课,累计费用120.00元,开课时间05.17,具体情况等通知.报名成功的同学请付款到本人支付宝: http://me.alipay.com/hustcer,逾期未付课程将被取消.',
    successMsg: '您的报名申请已经审核通过,烦请迅速缴费,逾期未付则课程将被取消.请谅解!',
    quitMsg:    '您的退课申请已经审核通过,欢迎您下次报名!',
	beginDate: 	'',
	endingDate: ''
};

/**
 * 当前开课情况:Jazz
 */
var cCourseJazz = {
   courseType: 'jazz', 
   courses: 	[{cValue: "6JZE1", cName: "第6期Jazz基础1班", ps:"上课时间：每周一晚7:40~8:30", cCapacity: 24, autoLimit: 24},
	 			 {cValue: "6JZE2", cName: "第6期Jazz基础2班", ps:"上课时间：每周二晚7:40~8:30", cCapacity: 24, autoLimit: 24},
	 			 {cValue: "6JZI",  cName: "第6期Jazz中级班",  ps:"上课时间：每周一晚6:40~7:30", cCapacity: 20, autoLimit: 20},
	 			 {cValue: "6JZA",  cName: "第6期Jazz提高班",  ps:"上课时间：每周二晚6:40~7:30", cCapacity: 20, autoLimit: 20}],
   cCapacity:   24, 
   // 锁定课程状态，禁止报名、退课等操作
   locked:    	true,
   // 是否开启报名自动审核
   autoApprove: true,
   // 是否男士报名优先，对于拉丁课男士优先则自动审核开启时男士报名自动审核通过
   manFirst:    false,
   // 自动审核报名成功的人数限制
   autoLimit:   24,
   notice:    	'上课地点:公司舞房.每个培训舞种共9次课,基础班费用50.00元,中级班或提高班费用60.00元,开课时间可能5月中旬,具体情况等通知.报名成功的同学请付款到本人支付宝: https://me.alipay.com/starsun,逾期未付款报名将被取消.',
   successMsg:  '您的报名申请已经审核通过,烦请迅速缴费,逾期未付则课程将被取消.请谅解!',
   quitMsg:     '您的退课申请已经审核通过,欢迎您下次报名!',
   beginDate:   '',
   endingDate: 	''
};

/**
 * 当前开课情况:Hiphop
 */
var cCourseHiphop = {
   courseType: 'hiphop', 
   courses:     [{cValue: "6HPI", cName: "第6期HipHop中级班", ps:"上课时间：每周一晚7:40~8:30", cCapacity: 24, autoLimit: 24}
                 ],
   cCapacity:   24, 
   // 锁定课程状态，禁止报名、退课等操作
   locked:      false,
   // 是否开启报名自动审核
   autoApprove: true,
   // 是否男士报名优先，对于拉丁课男士优先则自动审核开启时男士报名自动审核通过
   manFirst:    false,
   // 自动审核报名成功的人数限制
   autoLimit:   24,
   notice:      '上课地点:公司舞房.每个培训舞种共9次课,基础班费用50.00元,中级班或提高班费用60.00元,开课时间可能5月中旬,具体情况等通知.',
   successMsg:  '您的报名申请已经审核通过,烦请迅速缴费,逾期未付则课程将被取消.请谅解!',
   quitMsg:     '您的退课申请已经审核通过,欢迎您下次报名!',
   beginDate:   '',
   endingDate:  ''
};

/**
 * 课程命名方法：前面的数字代表培训期次编号，紧随其后的大写字母表示舞种:
 * R:Rumba; C:ChaCha; J:Jive; S:Samba; P:Paso doble;
 * 最后一个大写字母表示课程级别：E: Elementary 基础班;I: Intermediate 中级班; A: Advanced 高级班
 */
var courseLatinList = [
		{courseVal:'13SE', courseName:'第13期桑巴基础班'},
		{courseVal:'13CI', courseName:'第13期恰恰中级班'}
	];

/**
 * 课程命名方法：前面的数字代表培训期次编号，紧随其后的大写字母表示舞种:
 * JZ:jazz; 
 * 最后一个大写字母表示课程级别：E: Elementary 基础班;I: Intermediate 中级班; A: Advanced 高级班
 */
var courseJazzList = [
		{courseVal:'6JZI',  courseName:'第6期Jazz中级班'},
		{courseVal:'6JZA',  courseName:'第6期Jazz提高班'},
		{courseVal:'6JZE1', courseName:'第6期Jazz基础1班'},
		{courseVal:'6JZE2', courseName:'第6期Jazz基础2班'}
	];

/**
 * 课程命名方法：前面的数字代表培训期次编号，紧随其后的大写字母表示舞种:
 * HP:hiphop; 
 * 最后一个大写字母表示课程级别：E: Elementary 基础班;I: Intermediate 中级班; A: Advanced 高级班
 */
var courseHiphopList = [
        {courseVal:'6HPI',  courseName:'第6期HipHop中级班'}
    ];


exports.cCourses        = {cLatin:cCourseLatin, cJazz:cCourseJazz, cHiphop:cCourseHiphop};
exports.cCoursesList    = {latinList:courseLatinList, jazzList:courseJazzList, hiphopList:courseHiphopList};




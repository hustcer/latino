
/**
 * 培训课程信息
 *
 * Author: 	justin.maj
 * Date: 	2012-1-19  
 */

/**
 * 当前开课情况
 */
var cCourse = exports.currentCourse = {
	// **************	不同的舞种数据存储在不同的Collecion里面的，一定不能混存。	*************
	// **************	拉丁数据存储在dance数据库中的	latin  collecion中 	  	*************
	// **************	爵士数据存储在dance数据库中的	jazz   collecion中 		*************
	// **************	街舞数据存储在dance数据库中的	hiphop collecion中 		*************
	courseType: 'latin',		
	courseA: 	{cValue: "13SE", cName: "第13期桑巴基础班", ps:"上课时间：每周四晚6:30~7:30"},
	courseB: 	{cValue: "13CI", cName: "第13期恰恰中级班", ps:"上课时间：每周四晚7:40~8:40"},
	cCapacity: 	21, 
	// 锁定课程状态，禁止报名、退课等操作
	locked: 	false,
	// 是否开启报名自动审核
	autoApprove:true,
	// 是否男士报名优先，对于拉丁课男士优先则自动审核开启时男士报名自动审核通过
	manFirst: 	true,
	// 自动审核报名成功的人数限制
	autoLimit: 	6,
	notice: 	'上课地点:公司舞房.每个培训舞种共12次课,累计费用120.00元,开课时间5月初,可能5.3,具体情况等通知.报名成功的同学请付款到本人支付宝: http://me.alipay.com/hustcer ,逾期未付课程将被取消.',
	beginDate: 	'',
	endingDate: ''
};

/**
 * 课程命名方法：前面的数字代表培训期次编号，紧随其后的大写字母表示舞种:
 * R:Rumba; C:ChaCha; J:Jive; S:Samba; P:Paso doble;
 * 最后一个大写字母表示课程级别：E: Elementary 基础班;I: Intermediate 中级班; A: Advanced 高级班
 */
var courseLatin = exports.courseList = [
		{courseVal:'13SE',courseName:'第13期桑巴基础班'},
		{courseVal:'13CI',courseName:'第13期恰恰中级班'}
	];


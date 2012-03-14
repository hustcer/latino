
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
	courseA:{cValue: "13RI", cName: "第13期伦巴中级班", cCapacity:25, ps:"上课时间：每周四晚6:30~7:30, 公司舞房"},
	courseB:{cValue: "13CE", cName: "第13期恰恰基础班", cCapacity:25, ps:"上课时间：每周四晚7:40~8:40, 公司舞房"},
	locked: 	false,
	autoApprove:true,
	beginDate: 	'',
	endingDate: ''
};

/**
 * 课程命名方法：前面的数字代表培训期次编号，紧随其后的大写字母表示舞种:
 * R:Rumba; C:ChaCha; J:Jive; S:Samba; P:Paso doble;
 * 最后一个大写字母表示课程级别：E: Elementary 基础班;I: Intermediate 中级班; A: Advanced 高级班
 */
var courseList = exports.courseList = [
		{courseVal:'1RE',courseName:'第1期伦巴基础班'},
		{courseVal:'2RE',courseName:'第2期伦巴基础班'},
		{courseVal:'3RE',courseName:'第3期伦巴基础班'},
		{courseVal:'1CI',courseName:'第1期恰恰中级班'},
		{courseVal:'2CI',courseName:'第2期恰恰中级班'},
		{courseVal:'3CI',courseName:'第3期恰恰中级班'},
		{courseVal:'12JA',courseName:'第12期牛仔高级班'},
		{courseVal:'13RI',courseName:'第13期伦巴中级班'},
		{courseVal:'13CE',courseName:'第13期恰恰基础班'}
	];


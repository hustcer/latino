/**
 * 路径映射
 *
 * Author: 	justin.maj
 * Date: 	2012-1-19  
 */
var gRouter = exports.gRouter 	= {};

gRouter["/"] 					= require('./index.node.js').index;				// 首页
gRouter["/index"] 				= gRouter["/"];									// 首页

gRouter["/queryDancer/:id"] 	= require("./index.node.js").queryDancer;		// Ajax调用查询会员信息,用于动态加载报名表单会员信息数据
gRouter["/queryCourseInfo"]		= require("./index.node.js").queryCourseInfo;	// Ajax请求获取当前开课课程报名统计信息
gRouter["/quitCourse/:id"] 		= require("./index.node.js").quitCourse;		// Ajax调用会员申请退课
gRouter["/cancelCourse/:id"] 	= require("./index.node.js").cancelCourse;		// Ajax调用会员取消报名

gRouter["/list"] 				= require("./list.node.js").list;				// 会员列表
gRouter["/user/:id"] 			= require("./user.node.js").user;				// 会员信息
gRouter["/err404"] 				= require('./err404.node.js').err404;			// 404页面
gRouter["/*"] 					= gRouter["/err404"];							// 其他页面跳转到404


var adminRouter = exports.adminRouter = {};
adminRouter["/man"] 				= require("./admin.node.js").man;				// 管理员后台URL
adminRouter["/man/pay/:id"] 		= require("./admin.node.js").pay;				// Ajax调用设置会员为课程缴费
adminRouter["/man/unpay/:id"] 		= require("./admin.node.js").unpay;				// Ajax调用设置会员未缴费
adminRouter["/man/approve/:id"] 	= require("./admin.node.js").approve;			// Ajax调用设置会员报名成功
adminRouter["/man/refuse/:id"] 		= require("./admin.node.js").refuse;			// Ajax调用设置会员报名失败
adminRouter["/man/quit/:id"] 		= require("./admin.node.js").quit;				// Ajax调用设置会员退课成功
adminRouter["/man/quitRefuse/:id"] 	= require("./admin.node.js").quitRefuse;		// Ajax调用设置会员退课拒绝

adminRouter["/init/initdata"]		= require('./index.node.js').initdata;			// 初始化测试数据，该代码上线后应当被移除

/**
 * 提交表单路径映射
 */
var pRouter = exports.pRouter 	= {};

pRouter["/apply"] 				= require('./index.node.js').apply;				// 申请表单提交
pRouter["/search"] 				= require("./list.node.js").search;				// 会员列表查询表单

/**
 * 管理员提交表单路径映射
 */
var adminPostRouter = exports.adminPostRouter  = {};

adminPostRouter["/man/editDancer"]	= require("./admin.node.js").editDancer;	




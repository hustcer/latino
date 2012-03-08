/*
 * Author: justin.maj
 * Date: 20120225
*/
jQuery.namespace('dance.at.alibaba');             

jQuery(function($){

    var NS = dance.at.alibaba;

	// Begin Module Definition
    var module = NS.admin = {
					
		/**
		 * 静态模块的初始化入口
		 */
		init: function(){
		
			this._initUI();
			this._initHandler();
		},
		/**
		 * 模块的主要UI相关初始化
		 */
		_initUI: function(){

			this._initCourseApproveCombo();
			this._initCoursePaidCombo();
			this._initCourseRefuseCombo();
			this._initCourseQuitCombo();
			this._initCourseRefundCombo();

		},
		/**
		 * DOM事件绑定
		 */
		_initHandler: function(){

			// 报名审核通过
			this._handleApprove();
			// 设置会员已缴费
			this._handlePaid();
			// 报名审核不通过
			this._handleRefuse();
			// 设置会员未交费
			this._handleRefund();
			// 设置会员已退课
			this._handleQuit();
			// TODO: this._handleRefuseQuit();
			
		},
		/**
		 * 审核通过会员报名请求
		 */
		_handleApprove: function(){
			$("#approveBtn").click(function(){

				var dancerID = $("#approve-apply .dancerID").val(), 
					courseVal = $('input.result','#approve-apply .course-box').data('courseVal');

				$.getJSON('man/approve/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							$('#approve-apply p.course-tip').text('会员报名审核通过处理成功!').css('display','inline-block');
						}else{
							$('#approve-apply p.course-tip').text( data.msg ).css('display','inline-block');
						};
				});
				
			});
		},
		/**
		 * 设置会员已缴费
		 */
		_handlePaid: function(){
			$("#payBtn").click(function(){

				var dancerID = $("#course-pay .dancerID").val(), 
					courseVal = $('input.result','#course-pay .course-box').data('courseVal');

				$.getJSON('man/pay/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							$('#course-pay p.course-tip').text('设置会员缴费处理成功!').css('display','inline-block');
						}else{
							$('#course-pay p.course-tip').text(  data.msg ).css('display','inline-block');
						};
				});
				
			});
		},
		/**
		 * 拒绝会员报名请求
		 */
		_handleRefuse: function(){
			$("#refuseBtn").click(function(){

				var dancerID = $("#refuse-apply .dancerID").val(), 
					courseVal = $('input.result','#refuse-apply .course-box').data('courseVal');

				$.getJSON('man/refuse/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							$('#refuse-apply p.course-tip').text('拒绝会员报名处理成功!').css('display','inline-block');
						}else{
							$('#refuse-apply p.course-tip').text( data.msg ).css('display','inline-block');
						};
				});
				
			});
		},
		/**
		 * 处理会员退款请求
		 */
		_handleRefund: function(){
			$("#refundBtn").click(function(){

				var dancerID = $("#course-refund .dancerID").val(), 
					courseVal = $('input.result','#course-refund .course-box').data('courseVal');

				$.getJSON('man/unpay/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							$('#course-refund p.course-tip').text('会员退款处理成功!').css('display','inline-block');
						}else{
							$('#course-refund p.course-tip').text( data.msg ).css('display','inline-block');
						};
				});
				
			});
		},
		/**
		 * 处理会员申请退课请求
		 */
		_handleQuit: function(){
			$("#quitBtn").click(function(){

				var dancerID = $("#quit-approve .dancerID").val(), 
					courseVal = $('input.result','#quit-approve .course-box').data('courseVal');

				$.getJSON('man/quit/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							$('#quit-approve p.course-tip').text('会员退课处理成功!').css('display','inline-block');
						}else{
							$('#quit-approve p.course-tip').text( data.msg ).css('display','inline-block');
						};
				});
				
			});
		},
		/**
		 * 初始化审核通过课程下拉列表
		 */
		_initCourseApproveCombo: function(){
			$.use('ui-combobox', function(){
				$('#approve-apply .course-box').combobox({
				    data: $('#approve-apply .course-box select'),
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','#approve-apply .course-box').data('courseVal',$(this).combobox('val'));
					}
				});
			});
		},
		/**
		 * 初始化设置缴费课程下拉列表
		 */
		_initCoursePaidCombo: function(){
			$.use('ui-combobox', function(){
				$('#course-pay .course-box').combobox({
				    data: $('#course-pay .course-box select'),
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','#course-pay .course-box').data('courseVal',$(this).combobox('val'));
					}
				});
			});
		},
		/**
		 * 初始化审核拒绝课程状态下拉列表
		 */
		_initCourseRefuseCombo: function(){
			$.use('ui-combobox', function(){
				$('#refuse-apply .course-box').combobox({
				    data: $('#refuse-apply .course-box select'),
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','#refuse-apply .course-box').data('courseVal',$(this).combobox('val'));
					}

				});
			});
		}
		,
		/**
		 * 初始化退课审核通过课程下拉列表
		 */
		_initCourseQuitCombo: function(){
			$.use('ui-combobox', function(){
				$('#quit-approve .course-box').combobox({
				    data: $('#quit-approve .course-box select'),
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','#quit-approve .course-box').data('courseVal',$(this).combobox('val'));
					}
				});
			});
		},
		/**
		 * 初始化退费课程下拉列表
		 */
		_initCourseRefundCombo: function(){
			$.use('ui-combobox', function(){
				$('#course-refund .course-box').combobox({
				    data: $('#course-refund .course-box select'),
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','#course-refund .course-box').data('courseVal',$(this).combobox('val'));
					}
				});
			});
		}

	}
	// End Module Definition
	
    /**
     * 对模块进行初始化。如果模块挂在命名空间下，则可以在外部进行模块初始化，在闭包内则不需要再执行init函数。
     */
    module.init();
});
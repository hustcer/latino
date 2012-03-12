
/**
 * Admin front.
 *
 * Author: 	justin.maj
 * Date: 	2012-02-25   
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

			// 初始化combobox组件
			$('#admin-content .course-box').each(function(){
				var $box = $(this);

				$.use('ui-combobox', function(){

					$box.combobox({
					    data		: $('select', $box),
						// 绑定data.value 到 input上
						change: function(){
							$('input.result', $box).data('courseVal',$(this).combobox('val'));
						}
					});
				});
			});
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
			// 设置拒绝会员已退课
			this._handleRefuseQuit();
			
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
		 * 拒绝会员申请退课请求
		 */
		_handleRefuseQuit: function(){
			$("#quitRefuseBtn").click(function(){

				var dancerID = $("#quit-refuse .dancerID").val(), 
					courseVal = $('input.result','#quit-refuse .course-box').data('courseVal');

				$.getJSON('man/quitRefuse/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							$('#quit-refuse p.course-tip').text('会员退课拒绝处理成功!').css('display','inline-block');
						}else{
							$('#quit-refuse p.course-tip').text( data.msg ).css('display','inline-block');
						};
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
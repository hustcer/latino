
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
    	PAY_MSG: 			'设置会员缴费处理成功!',
    	QUIT_MSG: 			'会员退课处理成功!',
    	UNPAY_MSG: 			'会员退款处理成功!',
    	REFUSE_MSG: 		'拒绝会员报名处理成功!',
    	APPROVE_MSG: 		'会员报名审核通过处理成功!',
    	QUIT_REFUSE_MSG: 	'会员退课拒绝处理成功!',
    	MISSING_PARAM_MSG: 	'嗨，你参数没填完整吧 ? !',
					
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

			// 默认情况下禁用cache，消除IE下走cache导致请求没有发出去的问题
			$.ajaxSetup({
				cache: 	false,
				error: 	function(jqXHR, textStatus, errorThrown){

					console.log('Error Occured While Ajax Calling:', jqXHR, textStatus, errorThrown);
				}
			});

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

				var dancerID 	= $("#approve-apply .dancerID").val(), 
					$tipWrapper = $('#approve-apply p.course-tip'),
					courseVal 	= $('input.result','#approve-apply .course-box').data('courseVal');

				// 如果不存在会员ID或者课程值则不进行下一步操作
				if( !(!!dancerID && !!courseVal) ){	
					module._showTipInfo( $tipWrapper, module.MISSING_PARAM_MSG );
					return;	
				}

				$.getJSON('man/approve/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							module._showTipInfo( $tipWrapper, module.APPROVE_MSG );
						}else{
							module._showTipInfo( $tipWrapper, data.msg );
						};
				});
				
			});
		},
		/**
		 * 设置会员已缴费
		 */
		_handlePaid: function(){
			$("#payBtn").click(function(){

				var dancerID  	= $("#course-pay .dancerID").val(), 
					$tipWrapper = $('#course-pay p.course-tip'),
					courseVal 	= $('input.result','#course-pay .course-box').data('courseVal');

				// 如果不存在会员ID或者课程值则不进行下一步操作
				if( !(!!dancerID && !!courseVal) ){	
					module._showTipInfo( $tipWrapper, module.MISSING_PARAM_MSG );
					return;	
				}

				$.getJSON('man/pay/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							module._showTipInfo( $tipWrapper, module.PAY_MSG );
						}else{
							module._showTipInfo( $tipWrapper, data.msg );
						};
				});
				
			});
		},
		/**
		 * 拒绝会员报名请求
		 */
		_handleRefuse: function(){
			$("#refuseBtn").click(function(){

				var dancerID  	= $("#refuse-apply .dancerID").val(), 
					$tipWrapper = $('#refuse-apply p.course-tip'),
					courseVal 	= $('input.result','#refuse-apply .course-box').data('courseVal');

				// 如果不存在会员ID或者课程值则不进行下一步操作
				if( !(!!dancerID && !!courseVal) ){	
					module._showTipInfo( $tipWrapper, module.MISSING_PARAM_MSG );
					return;	
				}

				$.getJSON('man/refuse/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							module._showTipInfo( $tipWrapper, module.REFUSE_MSG);
						}else{
							module._showTipInfo( $tipWrapper, data.msg );
						};
				});
				
			});
		},
		/**
		 * 处理会员退款请求
		 */
		_handleRefund: function(){
			$("#refundBtn").click(function(){

				var dancerID  	= $("#course-refund .dancerID").val(), 
					$tipWrapper = $('#course-refund p.course-tip'),
					courseVal 	= $('input.result','#course-refund .course-box').data('courseVal');

				// 如果不存在会员ID或者课程值则不进行下一步操作
				if( !(!!dancerID && !!courseVal) ){	
					module._showTipInfo( $tipWrapper, module.MISSING_PARAM_MSG );
					return;	
				}

				$.getJSON('man/unpay/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							module._showTipInfo( $tipWrapper, module.UNPAY_MSG );
						}else{
							module._showTipInfo( $tipWrapper, data.msg );
						};
				});
				
			});
		},
		/**
		 * 处理会员申请退课请求
		 */
		_handleQuit: function(){
			$("#quitBtn").click(function(){

				var dancerID  	= $("#quit-approve .dancerID").val(), 
					$tipWrapper = $('#quit-approve p.course-tip'),
					courseVal 	= $('input.result','#quit-approve .course-box').data('courseVal');

				// 如果不存在会员ID或者课程值则不进行下一步操作
				if( !(!!dancerID && !!courseVal) ){	
					module._showTipInfo( $tipWrapper, module.MISSING_PARAM_MSG );
					return;	
				}

				$.getJSON('man/quit/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							module._showTipInfo( $tipWrapper, module.QUIT_MSG );
						}else{
							module._showTipInfo( $tipWrapper, data.msg );
						};
				});
				
			});
		},
		/**
		 * 拒绝会员申请退课请求
		 */
		_handleRefuseQuit: function(){
			$("#quitRefuseBtn").click(function(){

				var dancerID  	= $("#quit-refuse .dancerID").val(), 
					$tipWrapper = $('#quit-refuse p.course-tip'),
					courseVal 	= $('input.result','#quit-refuse .course-box').data('courseVal');

				// 如果不存在会员ID或者课程值则不进行下一步操作
				if( !(!!dancerID && !!courseVal) ){	
					module._showTipInfo( $tipWrapper, module.MISSING_PARAM_MSG );
					return;	
				}

				$.getJSON('man/quitRefuse/' + dancerID, 
					{ courseVal: courseVal }, function(data){
						if (data.success === true) {
							
							module._showTipInfo( $tipWrapper, module.QUIT_REFUSE_MSG );
						}else{
							module._showTipInfo( $tipWrapper, data.msg );
						};
				});
				
			});
		},
		/**
		 * 显示操作结果反馈信息
		 * @param $obj	承载提示信息的dom结构
		 * @param msg	对应的错误提示信息
		 */
		_showTipInfo: function($obj, msg){
			
			$obj.text(msg).css( 'display','inline-block' );

		}

	}
	// End Module Definition
	
    /**
     * 对模块进行初始化。如果模块挂在命名空间下，则可以在外部进行模块初始化，在闭包内则不需要再执行init函数。
     */
    module.init();
});
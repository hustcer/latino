
/**
 * Admin front.
 *
 * Author: 	hustcer
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

			this._initMenu();

			// 初始化课程选择combobox组件
			this._initComboBoxs();

			this._initDepartment();

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

			// 设置菜单条目点击时选中的菜单项
			this._menuClickHandler();
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
			// 修改会员信息，鼠标焦点离开
			this._idBlurHandler();
			// 表单提交、重置事件处理
			this._formActionHandler();

			// range值改变提示
			$('input.range-input','#dancer-edit').change(function(){
				$(this).parent().find('span.rangeVal').text($(this).val());
			});

		},
		/**
		 * 根据浏览器url设置当前选中的菜单项
		 */
		_initMenu: function(){
			// console.log(window.location.hash);
			if(window.location.hash === '#'||window.location.hash === ''){
				$('#approve-apply').fadeIn();
				// 设置当前菜单样式
				$('ul.admin-links li a[href="#approve-apply"]').css({color:'white'}).parent().css({background:'gray'});
			}else{
				var hash = window.location.hash;
				$(hash).fadeIn();
				// 设置当前菜单样式
				$('ul.admin-links li a[href=' + hash + ']').css({color:'white'}).parent().css({background:'gray'});
			}
		},
		/**
		 * 设置菜单条目点击时选中的菜单项
		 */
		_menuClickHandler: function(){
			$('ul.admin-links li a').click(function(){
				var href = $(this).prop('href'), blockSelector = href.substring(href.lastIndexOf('#'));
				// 重设其他菜单样式
				$('ul.admin-links li').css({background:'none'}).find('a').css({color:'#6D79E1'});
				// 设置当前菜单样式
				$(this).css({color:'white'}).parent().css({background:'gray'});
				
				$('div.admin-op').hide();
				$('p.course-tip', blockSelector).hide();
				$(blockSelector).slideDown('fast');
				return false;
			});
		},
		/**
		 * 初始化课程选择combobox组件
		 */
		_initComboBoxs: function(){
			// 初始化combobox组件
			$('#admin-content .course-box').each(function(){
				var $box = $(this);

				$.use('ui-combobox', function(){

					$box.combobox({
					    data  : $('select', $box),
						// 绑定data.value 到 input上
						change: function(){
							$('input.result', $box).data('courseVal',$(this).combobox('val'));
						}
					});
				});
			});
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

				var dancerID 	= $("#course-pay .dancerID").val(), 
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

				var dancerID 	= $("#refuse-apply .dancerID").val(), 
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

				var dancerID 	= $("#course-refund .dancerID").val(), 
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

				var dancerID 	= $("#quit-approve .dancerID").val(), 
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

				var dancerID 	= $("#quit-refuse .dancerID").val(), 
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
		 * 初始化部门选择下拉列表
		 */
		_initDepartment: function(){
			
			$.use('ui-combobox',function(){
				$('div.depart-select', '#dancer-edit').combobox({
				    data: 	[{text:'请选择部门...',value:''}, {text:'技术部',value:'tech'}, {text:'其他部门',value:'other'}],
				    name: 	"department",
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','div.depart-select').data('depart-value',$(this).combobox('val'));
					},
					listrender: function(){
						// 默认显示 “请选择部门...” 文案
						if($("div.depart-select input.result", '#dancer-edit').val() === "" ){
							$("div.depart-select input.result", '#dancer-edit').val("请选择部门...");	
						}
					}
				});
			});
		},
		/**
		 * 用户ID输入框失去焦点后触发事件
		 */
		_idBlurHandler: function(){

			$("#dancerID").blur(function(){
				
				var mid = $.trim($(this).val());
				if (mid === '') {return false;};

				$.getJSON('/queryDancer/' + mid, function(data){
					var $selectInput = $("div.depart-select input.result", '#dancer-edit');
					// 会员不存在的时候直接返回
					if (!(data && data.data)) {return false;};

					$('#vip').val(data.data.vip);
					$('#level').val(data.data.level);
					$('#email').val(data.data.email);
					$('#vipValue').text(data.data.vip);
					$('#levelValue').text(data.data.level);
					$('#wangWang').val(data.data.wangWang);
					$('#alipayID').val(data.data.alipayID);
					$('#extNumber').val(data.data.extNumber);
					$('#dancerName').val(data.data.dancerName);
					if (data.data.forever) {
						$('#forever').prop('checked',true);
					};

					if (data.data.gender === 'male') { 
						$('#maleRadio').prop('checked', true);
					}else{
						$('#femaleRadio').prop('checked', true);
					}
					if (data.data.department === 'tech') {
						// 回填表单department数据 
						$('#edit-container input.field').val('tech');
						$selectInput.val("技术部");

					}else if(data.data.department === 'other'){
						$('#edit-container input.field').val('other');
						$selectInput.val("其他部门");

					}else{
						$selectInput.val("请选择部门...");
					}

				});
			});
		},
		/**
		 * 表单提交、重置按钮事件
		 */
		_formActionHandler: function(){
			// 提交表单
			$('#confirm-btn').click(function(){

				var $editForm = $('#editForm');

				// 表单验证
				$.use("web-valid", function() {
					var validApply = new FE.ui.Valid($('input.comm-input', $editForm), {
	                    onValid : function(res, o) {
	                        var tr = $(this).closest('tr'), td = $('td:last-child', tr), msg = '';
	                        
	                        switch(res){
	                            case 'required':
	                                msg = '请填写该信息';
	                                break;
	                            case 'email':
	                                msg = '邮箱格式不对';
	                                break;
	                        }
	                        
	                        td.html(msg);
	                    }
					});

					if (validApply.valid()) {
						$editForm[0].submit();
					};

				});
				
			});

			// 重置表单
			$('#reset-btn').click(function(){
				$('#editForm')[0].reset();
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
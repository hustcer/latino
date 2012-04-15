
/**
 * Dancer index front.
 *
 * Author: 	justin.maj
 * Date: 	2012-02-25   
 */

jQuery.namespace('dance.at.alibaba');             

// 课程报名状态：已申请，取消申请，报名通过，报名拒绝，申请退课，已退课
jQuery(function($){

    var NS 			= dance.at.alibaba;    	

	// Begin Module Definition
    var module = NS.index = {
		QUIT_MSG: 	"您已经申请退课，请等待管理员审核！",
		CANCEL_MSG: "您好，你的报名取消成功，欢迎下次报名！",

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
			this._initDepartment();
			this._queryCourseInfo();
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

			this._idBlurHandler();
			this._formActionHandler();

			this._courseQuitHandler('A');
			this._courseQuitHandler('B');
			this._courseCancelHandler('A');
			this._courseCancelHandler('B');
		},
		/**
		 * 初始化部门选择下拉列表
		 */
		_initDepartment: function(){
			
			$.use('ui-combobox',function(){
				$('div.depart-select', '#dance-content').combobox({
				    data: 	[{text:'请选择部门...',value:''}, {text:'技术部',value:'tech'}, {text:'其他部门',value:'other'}],
				    name: 	"department",
					// 绑定data.value 到 input上
					change: function(){
						$('input.result','div.depart-select').data('depart-value',$(this).combobox('val'));
					},
					listrender: function(){
						// 默认显示 “请选择部门...” 文案
						if($("div.depart-select input.result", '#dance-content').val() === "" ){
							$("div.depart-select input.result", '#dance-content').val("请选择部门...");	
						}
					}
				});
			});
		},
		/**
		 * 通过Ajax请求取得当前开课课程的报名统计信息
		 */
		_queryCourseInfo: function(){
			$.getJSON('queryCourseInfo', function(data){
				// console.log('queryCourseInfo:', data);
				
				$('#aWaiting') .text(data.courseInfo.courseA.total + '人;');
				$('#bWaiting') .text(data.courseInfo.courseB.total + '人;');
				$('#aApproved').text(data.courseInfo.courseA.approved + '人;');
				$('#bApproved').text(data.courseInfo.courseB.approved + '人;');
			});

		},
		/**
		 * 表单提交、重置按钮事件
		 */
		_formActionHandler: function(){
			// 提交表单
			$('#apply-btn').click(function(){

				var $applyForm = $('#applyForm');

				// 表单验证
				$.use("web-valid", function() {
					var validApply = new FE.ui.Valid($('input.comm-input', $applyForm), {
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
						$applyForm[0].submit();
					};

				});
				
			});

			// 重置表单
			$('#reset-btn').click(function(){
				$('#applyForm')[0].reset();
				// 清除课程操作按钮
				$('div.operation-info').hide();
				$('div.course-wrapper a.course-btn').hide();
				$('div.course-wrapper p.course-tip').hide();
				$('div.course-wrapper input.comm-check').prop('disabled', false);
			});
		},
		/**
		 * 用户ID输入框失去焦点后触发事件
		 */
		_idBlurHandler: function(){

			$("#dancerID").blur(function(){
				
				var mid = $.trim($(this).val());
				if (mid === '') {return false;};

				$.getJSON('queryDancer/' + mid, function(data){
					var $selectInput = $("div.depart-select input.result", '#dance-content');
					// 会员不存在的时候直接返回
					if (!(data && data.data)) {return false;};

					$('#email').val(data.data.email.replace(/@alibaba-inc.com/, ''));
					$('#wangWang').val(data.data.wangWang);
					$('#alipayID').val(data.data.alipayID);
					$('#extNumber').val(data.data.extNumber);
					$('#dancerName').val(data.data.dancerName);

					if (data.data.gender === 'male') { 
						$('#maleRadio').prop('checked', true).prop('disabled', true);
						$('#femaleRadio').prop('disabled', true);
					}else{
						$('#femaleRadio').prop('checked', true).prop('disabled', true);
						$('#maleRadio').prop('disabled', true);
					}
					if (data.data.department === 'tech') {
						// 回填表单department数据 
						$('#apply-container input.field').val('tech');
						$selectInput.val("技术部");

					}else if(data.data.department === 'other'){
						$('#apply-container input.field').val('other');
						$selectInput.val("其他部门");

					}else{
						$selectInput.val("请选择部门...");
					}

					module._initCourseOperation( data );
				});
			});
		},
		/**
		 * 初始化课程可用操作
		 */
		_initCourseOperation: function(data){
			var courses = data.data.courses, 
				cA = $('#courseA').val(), 
				cB = $('#courseB').val(),
				checkedCount = 0;

			if (courses && courses.length > 0) {
				for (var i = courses.length - 1; i >= 0; i--) {
					if(courses[i].courseVal === cA){
						
						module._initCourseItemOperation(courses[i], 'A');
						checkedCount ++;
						// 不会开两个同样的课程（即便内容相同也会有不同的value），所以一旦匹配上就不再继续比较下去
						continue;

					}else if (courses[i].courseVal === cB) {

						module._initCourseItemOperation(courses[i], 'B');

						checkedCount ++;
						continue;

					};
					// 如果有两个课程被选中说明已经到达本期可报名课程上限，不用再继续检查了
					if (checkedCount >= 2) {break;};
				};
			}; // end outer if
		},
		/**
		 * 初始化每一个课程项在当前状态下可以进行的操作
		 * 课程一旦报名则不能随便退出，需要专门的退出逻辑所以报过名后对应的课程需要disable掉。
		 * 1. 未报过名的课程可以继续报名；
		 * 2. 报过名但是未审核的同学可以取消报名；
		 * 3. 报名且审核通过的同学可以申请退课；
		 * 4. 申请过退课的同学需要等待管理员审核才能进行下一步操作；
		 */
		_initCourseItemOperation: function(courseItem, courseNumber){

			if (courseItem.status === 'waiting'){
				$('#course' + courseNumber).prop("checked", true).prop("disabled", true);
				$('#cancelCourse' + courseNumber).show();
			}else if(courseItem.status === 'approved'){
				$('#course' + courseNumber).prop("checked", true).prop("disabled", true);
				$('#quitCourse' + courseNumber).show();
			}else if(courseItem.status === 'quitApplied'){
				$('#course' + courseNumber).prop("checked", true).prop("disabled", true);
				$('#tip' + courseNumber).text(module.QUIT_MSG).css('display','inline-block');
			}
			
		},
		/**
		 * 用户申请退课事件处理
		 * param courseNumber: A or B
		 */
		_courseQuitHandler: function( courseNumber ){

			$("#quitCourse" + courseNumber).live('click',function(){
				$.getJSON('quitCourse/' + $("#dancerID").val(), 
					{ courseVal: $("#course" + courseNumber).val() }, function(data){
						if (data.success === true) {
							// 申请退课成功后要把该按钮删掉
							$("#quitCourse" + courseNumber).hide();
							$('#tip' + courseNumber).text(module.QUIT_MSG).css('display','inline-block');
							
						};
				});
			});
		},
		/**
		 * 用户取消报名事件处理
		 * param courseNumber: A or B
		 */
		_courseCancelHandler: function( courseNumber ){

			$("#cancelCourse" + courseNumber).live('click',function(){
				$.getJSON('cancelCourse/' + $("#dancerID").val(), 
					{ courseVal: $("#course" + courseNumber).val() }, function(data){

						if (data.success === true) {
							$("#cancelCourse" + courseNumber).hide();
							$('#tip' + courseNumber).text(module.CANCEL_MSG).css('display','inline-block');
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
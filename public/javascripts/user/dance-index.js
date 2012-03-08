/*
 * Author: justin.maj
 * Date: 20120225
*/
jQuery.namespace('dance.at.alibaba');             

// TODO: 可以申请退课，可以取消退课申请，课程报名状态：已申请，取消申请，退课，取消退课，已通过，剩余名额，总名额
// TODO: 必填项、表单验证、添加表单重置按钮
jQuery(function($){

    var NS = dance.at.alibaba;
    var quitMsg = "您已经申请退课，请等待管理员审核";

	// Begin Module Definition
    var module = NS.index = {
					
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
		},
		/**
		 * DOM事件绑定
		 */
		_initHandler: function(){

			this._idBlurHandler();

			this._courseAQuitHandler();
			this._courseBQuitHandler();

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

					$('#dancerName').val(data.data.dancerName);
					$('#email').val(data.data.email);
					$('#wangWang').val(data.data.wangWang);
					$('#extNumber').val(data.data.extNumber);
					$('#alipayID').val(data.data.alipayID);

					if (data.data.gender === 'male') { 
						$('#maleRadio').prop('checked', true);
					}else{
						$('#femaleRadio').prop('checked', true);
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

					NS.index._initCourseOperation( data );
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
						// 课程一旦报名则不能随便退出，需要专门的退出逻辑所以报过名后对应的课程需要disable掉。
						// 不过未报过名的课程可以继续报名
						// 报过名或者报名且审核通过的同学可以申请退课
						// 申请过退课的同学需要等待管理员审核才能进行下一步操作
						if (courses[i].status === 'waiting' || courses[i].status === 'approved') {
							$('#courseA').prop("checked", true).prop("disabled", true);
							if ($('#quitCourseA').length === 0) {
								$('#courseAWrapper').append('<a href="javascript:;" id="quitCourseA" class="comm-btn quit-apply">申请退课</a>');
							}
						}else if (courses[i].status === 'quitApplied' ) {
							$('#courseA').prop("checked", true).prop("disabled", true);
							if ( $('#courseAWrapper p.course-tip').length === 0 ) {
								$('#courseAWrapper').append('<p class="course-tip">' + quitMsg + '</p>');
							}
						};
						
						checkedCount ++;
						// 不会开两个同样的课程（即便内容相同也会有不同的value），所以一旦匹配上就不再继续比较下去
						continue;

					}else if (courses[i].courseVal === cB) {
						if (courses[i].status === 'waiting' || courses[i].status === 'approved') {
							$('#courseB').prop("checked", true).prop("disabled", true);
							if ($('#quitCourseB').length === 0) {
								$('#courseBWrapper').append('<a href="javascript:;" id="quitCourseB" class="comm-btn quit-apply">申请退课</a>');
							};

						}else if (courses[i].status === 'quitApplied' ) {
							$('#courseB').prop("checked", true).prop("disabled", true);
							// 如果没有退课提示则加上退课提示，防止多次blur事件引起多个提示同时显示
							if ( $('#courseBWrapper p.course-tip').length === 0 ) {
								$('#courseBWrapper').append('<p class="course-tip">' + quitMsg + '</p>');
							};
							
						};

						checkedCount ++;
						continue;

					};
					// 如果有两个课程被选中说明已经到达本期可报名课程上限，不用再继续检查了
					if (checkedCount >= 2) {break;};
				};
			}; // end outer if
		},
		/**
		 * 用户申请退课A
		 */
		_courseAQuitHandler: function(){

			$("#quitCourseA").live('click',function(){
				$.getJSON('quitCourse/' + $("#dancerID").val(), 
					{ courseVal: $("#courseA").val() }, function(data){
						if (data.success === true) {
							// 申请退课成功后要把该按钮删掉
							$("#quitCourseA").remove();
							$('#courseAWrapper').append('<p class="course-tip">' + quitMsg + '</p>');
						};
				});
			});
		},
		/**
		 * 用户申请退课B
		 */
		_courseBQuitHandler: function(){

			$("#quitCourseB").live('click',function(){
				$.getJSON('quitCourse/' + $("#dancerID").val(), 
					{ courseVal: $("#courseB").val() }, function(data){

						if (data.success === true) {
							$("#quitCourseB").remove();
							$('#courseBWrapper').append('<p class="course-tip">' + quitMsg + '</p>');
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
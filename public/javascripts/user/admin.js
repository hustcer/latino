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

			this._initCourseCombo1();
			this._initCourseCombo2();
			this._initCourseCombo3();
			this._initCourseCombo4();
			this._initCourseCombo5();

		},
		/**
		 * DOM事件绑定
		 */
		_initHandler: function(){

			

		},
		/**
		 * 会员查询筛选
		 */
		_queryHandler: function(){

			
		},
		/**
		 * 初始化部门下拉列表
		 */
		_initCourseCombo1: function(){
			$.use('ui-combobox', function(){
				$('#approve-apply .course-box').combobox({
				    data: $('#approve-apply .course-box select')
				});
			});
		},
		/**
		 * 初始化课程下拉列表
		 */
		_initCourseCombo2: function(){
			$.use('ui-combobox', function(){
				$('#course-pay .course-box').combobox({
				    data: $('#course-pay .course-box select')
				});
			});
		},
		/**
		 * 初始化课程状态下拉列表
		 */
		_initCourseCombo3: function(){
			$.use('ui-combobox', function(){
				$('#refuse-apply .course-box').combobox({
				    data: $('#refuse-apply .course-box select')
				});
			});
		}
		,
		/**
		 * 初始化课程下拉列表
		 */
		_initCourseCombo4: function(){
			$.use('ui-combobox', function(){
				$('#quit-approve .course-box').combobox({
				    data: $('#quit-approve .course-box select')
				});
			});
		},
		/**
		 * 初始化课程状态下拉列表
		 */
		_initCourseCombo5: function(){
			$.use('ui-combobox', function(){
				$('#course-refund .course-box').combobox({
				    data: $('#course-refund .course-box select')
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
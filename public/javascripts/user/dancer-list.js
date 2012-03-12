
/**
 * Dancer list front.
 *
 * Author: 	justin.maj
 * Date: 	2012-1-20   
 */

jQuery.namespace('dance.at.alibaba.list');             

// TODO:输出信息格式化，默认查询当前开课课程信息
jQuery(function($){

    var NS = dance.at.alibaba.list;

	// Begin Module Definition
    var module = NS.main = {
					
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

			this._initDepartmentList();
			this._initCourseList();
			this._initCourseStatus();
		},
		/**
		 * DOM事件绑定
		 */
		_initHandler: function(){

			this._queryHandler();
		},
		/**
		 * 会员查询筛选
		 */
		_queryHandler: function(){

			$('#queryBtn').click(function(){
				
				$.post('/search', $("#searchForm").serialize(), function(data) {

					var data = data.data, html = [];
				    for (var i = 0, n = data.length; i < n; i++) {
				    	html.push('<tr><td><a href="/user/' + data[i].dancerID +' " target="_blank" >');
				    	html.push(data[i].dancerID);
				    	html.push('</a></td><td>');
				    	html.push(data[i].dancerName);
				    	html.push('</td><td>');
				    	html.push(data[i].gender);
				    	html.push('</td><td>');
				    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
				    		html.push(data[i].courses[m].courseVal + ';');
				    	};
				    	html.push('</td><td>');
				    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
				    		html.push(data[i].courses[m].status + ';');
				    	};
				    	html.push('</td><td>');
				    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
				    		html.push(data[i].courses[m].paid + ';');
				    	};
				    	html.push('</td><td>');
				    	html.push(data[i].email);
				    	html.push('</td><td>');
				    	html.push(data[i].wangWang);
				    	html.push('</td><td>');
				    	html.push(data[i].extNumber);
				    	html.push('</td><td>');
				    	html.push(data[i].department);
				    	html.push('</td></tr>');
				    };

				    $('#dancer-list table tbody').html(html.join(''));

				}, 'json' );
			});
		},
		/**
		 * 初始化部门下拉列表
		 */
		_initDepartmentList: function(){
			$.use('ui-combobox', function(){
				$('#department-box').combobox({
				    data: $('#department-box select')
				});
			});
		},
		/**
		 * 初始化课程下拉列表
		 */
		_initCourseList: function(){
			$.use('ui-combobox', function(){
				$('#course-box').combobox({
				    data: $('#course-box select')
				});
			});
		},
		/**
		 * 初始化课程状态下拉列表
		 */
		_initCourseStatus: function(){
			$.use('ui-combobox', function(){
				$('#status-box').combobox({
				    data: $('#status-box select')
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

/**
 * Dancer list front.
 *
 * Author: 	justin.maj
 * Date: 	2012-1-20   
 */

jQuery.namespace('dance.at.alibaba');             

// TODO:输出信息格式化，默认查询当前开课课程信息
jQuery(function($){

    var NS = dance.at.alibaba;

	// Begin Module Definition
    var module = NS.list = {

    	/**
		 * 会员列表分页组件
		 */
    	dancerListPg: 	null,

    	/**
		 * 会员列表数据
		 */
    	resultList: 	null,

    	/**
		 * 每个分页记录数目
		 */
    	itemPerPage: 	20,

    	/**
		 * 总分页数
		 */
    	totalPage: 		1,

		/**
		 * 没有满足条件的查询结果的HTML
		 */
		noResult: 		'<tr><td colspan="8" class="list-empty">矮油，没有满足条件的会员歪！</td></tr>',	

    	/**
		 * 显示正在加载数据的HTML
		 */
    	loadingHtml: 	'<tr><td colspan="8" class="loading"><img src="./images/loading.gif"><p>数据正在加载请稍后...</p></td></tr>',

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
			
			// 初始化combobox通用化
			this._initFilterCombo();
		},
		/**
		 * DOM事件绑定
		 */
		_initHandler: function(){

			this._queryHandler();

			this._handleSort("dancerID-header", "dancerID");
			this._handleSort("dancerName-header", "dancerName");
			this._handleSort("gender-header", "gender");
			this._handleSort("email-header", "email");
			this._handleSort("wangWang-header", "wangWang");
			this._handleSort("ext-header", "extNumber");
			this._handleSort("dept-header", "department");

			// FIXME:一开始combox dom 还没有创建完毕 $('#course-box input.field').val() 为undefined
			// 所以这里加了一个丑陋的延时来修正，后面注意考虑更合适的方案。
			setTimeout( function(){
				$('#queryBtn').trigger('click');
			}, 100);
			
		},
		/**
		 * 会员查询筛选
		 */
		_queryHandler: function(){
			// FIXME: 数据获取失败处理
			$('#queryBtn').click(function(){

				$('#dancer-list table tbody').html(module.loadingHtml);

				$.post('/search', $("#searchForm").serialize(), function(data) {

					module.resultList = data.data;

					// console.log(data.data);

					module._initPagination();

				}, 'json' );
			});
		},
		/**
		 * 初始化Select下拉列表
		 */
		_initFilterCombo: function(){
			var initCombo = function( box ){
				$.use('ui-combobox', function(){
					box.combobox({
					    data: $('select.comm-select', box)
					});
				});
			};

			$('#dancer-filter div.filter-combo').each(function(){
				
				initCombo($(this));
			});
		},
		/**
		 * 分页组件相关初始化
		 */
		_initPagination: function(){
			// FIXME:resultList IS NULL OR NOT?
			dancerListPg = new dance.at.alibaba.Paging( $('#dancer-list-paging') );
			
			if ( this.resultList.length === 0 ) {
				
				$('#dancer-list table tbody').html(module.noResult);
				dancerListPg.init(1, 1);
				return;
			};

			this.totalPage = Math.ceil( this.resultList.length / this.itemPerPage );
			dancerListPg.init(1, this.totalPage);

			var html = this._renderRowHtml( this.resultList.slice(0, this.itemPerPage) );
			$('#dancer-list table tbody').html(html);
			$('#dancer-list table tbody tr:odd').css({background:'white'});
    		
    		dancerListPg.customClick = function(page){

    			var data = module.resultList.slice( (page - 1) * module.itemPerPage, 
    													   page * module.itemPerPage);
				html = module._renderRowHtml( data );
				$('#dancer-list table tbody').html(html);
				$('#dancer-list table tbody tr:odd').css({background:'white'});
			}
		},
		/**
		 * 对指定Class表头的指定字段进行排序
		 */
		_handleSort: function( headClassName, dataKeyName ){
			
			$("#dancer-list ." + headClassName ).click(function(){
				
				module._resetOrderStatus(headClassName);
				
				var sortIcon = $("i",this);
				if( sortIcon.hasClass("i-sort-default") || sortIcon.hasClass("i-sort-up")){
					module.resultList = json.array.util.sortOrder(module.resultList, dataKeyName, -1);
					sortIcon.attr('class', 'i-sort-down').text('▼');
				}else{
					module.resultList = json.array.util.sortOrder(module.resultList, dataKeyName, 1);
					sortIcon.attr('class', 'i-sort-up').text('▲');
				}
				
				module._refreshTableData( module._getCurrentPgIndex() );
			});
		},
		/**
		 * 重置除className以外的表头排序标记
		 */
		_resetOrderStatus: function( className ){
			var allClass = ["dancerID-header", "dancerName-header", "gender-header", "course-header",
							 "email-header", "wangWang-header", "ext-header", "dept-header"];
			
			for(var i = 0, l = allClass.length; i < l; i++ ){
				if(allClass[i] !== className){
					$("#dancer-list ." + allClass[i] + " i").attr('class', 'i-sort-default').text('◆');
				}
			}
		},
		/**
		 * 取得当前显示页的页码
		 */
		_getCurrentPgIndex: function(){
			var aNext, pageIndex = 0;
			// 重新排序后显示对应分页：根据下一页上的页码推知当前页页码
			aNext = $("li.pagination a.next", "#dancer-list-paging");
			if (aNext.length > 0){
				pageIndex  = aNext.attr("page") - 1;
			}
			else{ 
				// 如果下一页不可点击说明当前为最后一页
				pageIndex = this.totalPage ;
			}
			return pageIndex;
		},
		/**
		 * 显示对应分页的数据
		 * @param currentPage 对应需要显示的分页页码
		 */
		_refreshTableData: function( currentPage ){
			if( currentPage === undefined || currentPage < 1 ||
				currentPage > Math.ceil(module.resultList.length / module.itemPerPage) ) currentPage = 1;
					
				var data = 	module.resultList.slice( (currentPage - 1) * module.itemPerPage, 
							currentPage * module.itemPerPage );
	
				$('#dancer-list table tbody').html(this._renderRowHtml( data ));

		},
		/**
		 * 将data Array对应的数据渲染成相应的html
		 */
		_renderRowHtml: function( data ){
			var cCourseCond = $('#course-box input.field').val(), html = [], date;
			for (var i = 0, n = data.length; i < n; i++) {
		    	html.push('<tr><td><a href="/user/' + data[i].dancerID +' " target="_blank" >');
		    	html.push(data[i].dancerID);
		    	html.push('</a></td><td>');
		    	html.push(data[i].dancerName);
		    	html.push('</td><td>');
		    	html.push(data[i].gender === 'male'? 'M':'F');
		    	html.push('</td><td class="BW">');
		    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
		    		date = new Date(Date.parse(data[i].courses[m].applyTime)).format('yyyy/MM/dd hh:mm:ss');
		    		// 如果当前课程筛选条件不为空则过滤只显示当前课程
		    		if( !!cCourseCond ){

		    			if( data[i].courses[m].courseVal === cCourseCond ){
		    				html.push( data[i].courses[m].courseVal + ';' );
		    				html.push(module._getCourseStatus(data[i].courses[m]));
		    				html.push( data[i].courses[m].paid ? '缴费:Y;':'缴费:N;' );

		    				html.push('报名时间:' + date );
		    				html.push('<br/>');
		    				
		    			}
		    			
		    		}else{
		    			html.push(data[i].courses[m].courseVal + ';');
		    			html.push(module._getCourseStatus(data[i].courses[m]));
		    			html.push( data[i].courses[m].paid ? '缴费:Y;':'缴费:N;' );
		    			html.push('报名时间:' + date );
		    			html.push('<br/>');
		    		}
		    	};
		    	
		    	html.push('</td><td>');
		    	html.push(data[i].email);
		    	html.push('</td><td>');
		    	html.push(data[i].wangWang);
		    	html.push('</td><td>');
		    	html.push(data[i].extNumber);
		    	html.push('</td><td>');

		    	switch(data[i].department){
		    		case 'tech':
		    			html.push('技术部');
		    			break;
		    		case 'other':
		    			html.push('其他部门');
		    			break;
		    		default:
		    			html.push('---');
		    			break;
		    	}
		    	
		    	html.push('</td></tr>');
		    };
		    return html.join('');
		},
		/**
		 * 根据课程返回其对应的状态描述信息
		 */
		_getCourseStatus: function( course ){
			var status = '';
			switch(course.status){
	    		case 'waiting':
	    			status = ('等待审核;');
	    			break;
	    		case 'approved':
	    			status = ('报名成功;');
	    			break;
	    		case 'refused':
	    			status = ('报名失败;');
	    			break;
	    		case 'quitApplied':
	    			status = ('申请退课;');
	    			break;
	    		case 'quit':
	    			status = ('已经退课;');
	    			break;
	    		case 'cancelled':
	    			status = ('取消报名;');
	    			break;
	    		default:
	    			status = ('未知状态;');
	    			break;
	    	};
	    	return status;
		}

	}
	// End Module Definition
	
    /**
     * 对模块进行初始化。如果模块挂在命名空间下，则可以在外部进行模块初始化，在闭包内则不需要再执行init函数。
     */
    module.init();
});
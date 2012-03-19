
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
			// this._handleSort("course-header", "searchTimes");
			// this._handleSort("status-header", "changeTrend");
			// this._handleSort("pay-header", "ctr");
			this._handleSort("email-header", "email");
			this._handleSort("wangWang-header", "wangWang");
			this._handleSort("ext-header", "extNumber");
			this._handleSort("dept-header", "department");
		},
		/**
		 * 会员查询筛选
		 */
		_queryHandler: function(){
			// FIXME: 数据获取失败处理
			$('#queryBtn').click(function(){
				
				$.post('/search', $("#searchForm").serialize(), function(data) {

					NS.list.resultList = data.data;

					console.log(data.data);

					NS.list._initPagination();

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
			
			this.totalPage = Math.ceil( this.resultList.length / this.itemPerPage );
			dancerListPg.init(1, this.totalPage);

			var html = this._renderRowHtml( this.resultList.slice(0, this.itemPerPage) );
			$('#dancer-list table tbody').html(html);
    		
    		dancerListPg.customClick = function(page){

    			var data = NS.list.resultList.slice( (page - 1) * NS.list.itemPerPage, 
    													   page * NS.list.itemPerPage);
				html = NS.list._renderRowHtml( data );
				$('#dancer-list table tbody').html(html);
			}
		},
		/**
		 * 对指定Class表头的指定字段进行排序
		 */
		_handleSort: function( headClassName, dataKeyName ){
			
			$("#dancer-list ." + headClassName ).click(function(){
				
				NS.list._resetOrderStatus(headClassName);
				
				var sortIcon = $("i",this);
				if( sortIcon.hasClass("i-sort-default") || sortIcon.hasClass("i-sort-up")){
					NS.list.resultList = json.array.util.sortOrder(NS.list.resultList, dataKeyName, -1);
					sortIcon.attr('class', 'i-sort-down');
				}else{
					NS.list.resultList = json.array.util.sortOrder(NS.list.resultList, dataKeyName, 1);
					sortIcon.attr('class', 'i-sort-up');
				}
				
				NS.list._refreshTableData( NS.list._getCurrentPgIndex() );
			});
		},
		/**
		 * 重置除className以外的表头排序标记
		 */
		_resetOrderStatus: function( className ){
			var allClass = ["dancerID-header", "dancerName-header", "gender-header", "course-header",
							"status-header", "pay-header", "email-header", "wangWang-header", 
							"ext-header", "dept-header"];
			
			for(var i = 0, l = allClass.length; i < l; i++ ){
				if(allClass[i] !== className){
					$("#dancer-list ." + allClass[i] + " i").attr('class', 'i-sort-default');
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
				currentPage > Math.ceil(NS.list.resultList.length / NS.list.itemPerPage) ) currentPage = 1;
					
				var data = 	NS.list.resultList.slice( (currentPage - 1) * NS.list.itemPerPage, 
							currentPage * NS.list.itemPerPage );
	
				$('#dancer-list table tbody').html(this._renderRowHtml( data ));

		},
		/**
		 * 将data Array对应的数据渲染成相应的html
		 */
		_renderRowHtml: function( data ){
			var html = [];
			for (var i = 0, n = data.length; i < n; i++) {
		    	html.push('<tr><td><a href="/user/' + data[i].dancerID +' " target="_blank" >');
		    	html.push(data[i].dancerID);
		    	html.push('</a></td><td>');
		    	html.push(data[i].dancerName);
		    	html.push('</td><td>');
		    	html.push(data[i].gender === 'male'? 'M':'F');
		    	html.push('</td><td class="BW">');
		    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
		    		html.push(data[i].courses[m].courseVal + ';');
		    	};
		    	html.push('</td><td class="BW">');

		    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
		    		switch(data[i].courses[m].status){
			    		case 'waiting':
			    			html.push('待审核;');
			    			break;
			    		case 'approved':
			    			html.push('报名成功;');
			    			break;
			    		case 'refused':
			    			html.push('报名失败;');
			    			break;
			    		case 'quitApplied':
			    			html.push('申请退课;');
			    			break;
			    		case 'quit':
			    			html.push('已退课;');
			    			break;
			    		case 'cancelled':
			    			html.push('取消报名;');
			    			break;
			    		default:
			    			html.push('未知;');
			    			break;
			    	}
		    	};
		    	html.push('</td><td class="BW">');
		    	for (var m = 0,l = data[i].courses.length; m < l; m++) {
		    		html.push( data[i].courses[m].paid ? 'Y':'N' + ';' );
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
		    			html.push('未知部门');
		    			break;
		    	}
		    	
		    	html.push('</td></tr>');
		    };
		    return html.join('');
		}

	}
	// End Module Definition
	
    /**
     * 对模块进行初始化。如果模块挂在命名空间下，则可以在外部进行模块初始化，在闭包内则不需要再执行init函数。
     */
    module.init();
});
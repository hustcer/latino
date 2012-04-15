
/**
 * Dancer list front.
 *
 * Author: 	justin.maj
 * Date: 	2012-1-20   
 */

jQuery.namespace('dance.at.alibaba');             

// 默认查询当前开课课程信息
jQuery(function($){

    var NS = dance.at.alibaba;
    var $filter 	= $('#dancer-filter'),
    	$tableBody 	= $('#dancer-list table tbody');

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
			this._clearCondHandler();
			this._breadRemoveHandler();

			// 导出满足当前查询条件的会员邮件列表，这个功能是非公开的呃，不能随便什么人都来用
			if(window.location.hash === '#em'){
				$('button.email-btn', $filter).show();
				this._getMailListHandler();
			}
			
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

				$tableBody.html(module.loadingHtml);

				$.post('/search', $("#searchForm").serialize(), function(data) {

					module.resultList = data.data;

					// console.log(data.data);

					module._initPagination();
					// 显示当前查询条件对应的面包屑
					module._buildBread();

				}, 'json' );
			});
		},
		/**
		 * 清除查询条件按钮点击后响应。
		 */
		_clearCondHandler: function(){
			
			$('button.clear-btn', $filter).click(function(){
				$('span.cond-item', $filter).find('p').text('').end().hide();
				$('#dancerID').val('');
				$('#maleRadio')	 .prop('checked',false);
				$('#femaleRadio').prop('checked',false);
				$('#paidRadio')  .prop('checked',false);
				$('#unpayRadio') .prop('checked',false);

				$('#course-box input.field').val('');
				$('#status-box input.field').val('');
				$('#department-box input.field').val('');

				$('#course-box div.ui-combobox-panel ul li').removeClass('ui-combobox-selected');
				$('#status-box div.ui-combobox-panel ul li').removeClass('ui-combobox-selected');
				$('#department-box div.ui-combobox-panel ul li').removeClass('ui-combobox-selected');

				$('#course-box input.result').val('请选择...');
				$('#status-box input.result').val('请选择...');
				$('#department-box input.result').val('请选择...');

			});
		},
		/**
		 * 删除面包屑条目事件响应
		 */
		_breadRemoveHandler: function(){
			$('span.id-cond span.close', $filter).click(function(){
				$(this).parent().find('p').text('').end().hide();
				$('#dancerID').val('');
			});
			$('span.dep-cond span.close', $filter).click(function(){
				$(this).parent().find('p').text('').end().hide();
				$('#department-box input.field').val('');
				$('#department-box input.result').val('请选择...');
				$('#department-box div.ui-combobox-panel ul li').removeClass('ui-combobox-selected');

			});
			$('span.gender-cond span.close', $filter).click(function(){
				$(this).parent().find('p').text('').end().hide();
				$('#maleRadio')	 .prop('checked',false);
				$('#femaleRadio').prop('checked',false);
			});
			$('span.cval-cond span.close', $filter).click(function(){
				$(this).parent().find('p').text('').end().hide();
				$('#course-box input.field').val('');
				$('#course-box input.result').val('请选择...');
				$('#course-box div.ui-combobox-panel ul li').removeClass('ui-combobox-selected');
			});
			$('span.cstatus-cond span.close', $filter).click(function(){
				$(this).parent().find('p').text('').end().hide();
				$('#status-box input.field').val('');
				$('#status-box input.result').val('请选择...');
				$('#status-box div.ui-combobox-panel ul li').removeClass('ui-combobox-selected');
			});
			$('span.cpay-cond span.close', $filter).click(function(){
				$(this).parent().find('p').text('').end().hide();
				$('#paidRadio')  .prop('checked',false);
				$('#unpayRadio') .prop('checked',false);
			});
		},
		/**
		 * 获取满足当前查询条件的会员的邮件列表
		 */
		_getMailListHandler: function(){
			$('button.email-btn', $filter).click(function(){
				$.getJSON('/list/queryEmail', $("#searchForm").serialize(), function(data) {

					$('#list-content').append('<p class="email-result"></p>')
									  .find('p.email-result').empty()
									  .text(data.data + ';');
					
				});
			});
		},
		/**
		 * 根据当前查询条件设置面包屑提示
		 */
		_buildBread: function(){
			 
			var	dID 	= $.trim($('#dancerID').val()),
				depVal 	= $('#department-box input.field').val(),
				cVal 	= $('#course-box input.field').val(),
				cStatus = $('#status-box input.field').val(),
				male 	= $('#maleRadio')	.prop('checked'),
				female  = $('#femaleRadio')	.prop('checked'),
				paid 	= $('#paidRadio')	.prop('checked'),
				unpay 	= $('#unpayRadio')	.prop('checked');

			if ( !!dID ) 	{ $('span.id-cond p',  		$filter).text(dID); }
			if ( male ) 	{ $('span.gender-cond p', 	$filter).text('男'); };
			if ( female ) 	{ $('span.gender-cond p', 	$filter).text('女'); };
			if ( paid ) 	{ $('span.cpay-cond p', 	$filter).text('已缴费'); };
			if ( unpay ) 	{ $('span.cpay-cond p', 	$filter).text('未缴费'); };
			
			if ( !!depVal ) { $('span.dep-cond p', 		$filter).text( $('#department-box input.result').val() ); }
			if ( !!cVal ) 	{ $('span.cval-cond p', 	$filter).text( $('#course-box input.result').val() ); } 
			if ( !!cStatus ){ $('span.cstatus-cond p', 	$filter).text( $('#status-box input.result').val() ); } 
			
			$('span.cond-item', $filter).each ( function(){
				if( !! $.trim($('p', this).text()) ){
					$(this).show();
				}else{
					$(this).hide();
				}
			} );
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

			$('div.filter-combo', $filter).each(function(){
				
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
				
				$tableBody.html(module.noResult);
				dancerListPg.init(1, 1);
				return;
			};

			this.totalPage = Math.ceil( this.resultList.length / this.itemPerPage );
			dancerListPg.init(1, this.totalPage);

			var html = this._renderRowHtml( this.resultList.slice(0, this.itemPerPage) );
			$tableBody.html(html);
			$('tr:odd', $tableBody).css({background:'ivory'});
    		
    		dancerListPg.customClick = function(page){

    			var data = module.resultList.slice( (page - 1) * module.itemPerPage, 
    													   page * module.itemPerPage);
				html = module._renderRowHtml( data );
				$tableBody.html(html);
				$('tr:odd', $tableBody).css({background:'ivory'});
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
	
				$tableBody.html(this._renderRowHtml( data ));

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

		    	$.use("util-date",function(){
				        
				    for (var m = 0,l = data[i].courses.length; m < l; m++) {
				    	// 本方法在ie浏览器下有问题，故而用util-date取代
			    		// date = new Date(Date.parse(data[i].courses[m].applyTime)).format('yyyy/MM/dd hh:mm:ss');

			    		date = Date.parseDate(data[i].courses[m].applyTime, "yyyy-MM-dd hh:mm:ss").format('yyyy/MM/dd hh:mm:ss');
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
				});
		    	
		    	
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
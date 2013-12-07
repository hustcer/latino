/**
 * 分页JS
 * Imported by hustcer
 *
 * (从fdev3的代码片段中修改产生)
 * 修改点:   1：YUI实现改成jquery实现
 *          2：增加点击页码后的自定义事件提供给外部使用
 */
jQuery.namespace('dance.at.alibaba');

(function($, DAA) {

var Paging = function(paging, configs){

    this.pagination = $('li.pagination', paging);
    this.pagem      = $('em.pagenum', paging);
    this.pagenum    = $('input.pnum', paging);
    this.pagesubmit = $('a.btn-b', paging);
    this.configs    = configs || {};
};

Paging.prototype = {

    init: function(cur, total){

        // Valid Page Number
        var pnReg = /^[1-9]\d*$/, pnCache = '', scope = this;

        function vPn(){
            if ($(this).val()) {
                if (pnReg.test($(this).val())) {
                    pnCache = $(this).val();
                }
                else $(this).val(pnCache);
            }
            else pnCache = '';
        }

        this.pagenum.bind("focus", function(){
            this.select();
        });

        this.pagenum.bind("keydown", function(e){
            if (e.keyCode && e.keyCode === 13) {
                scope.pagesubmit.click();
                this.select();
            }
        });

        this.pagenum.bind("keyup", vPn);
        this.pagenum.bind("blur", vPn);
        // Jump To Event Handler
        // 在绑定翻页之前要先清除之前绑定的事件
        this.pagesubmit.unbind('click.paging').bind("click.paging", function(e){
            e.preventDefault();
            if (!scope.pagenum.val())
                return;
            var num = ( scope.pagenum.val() || 0 ) * 1, max = scope.pagenum.max * 1;
            if (num > max)
                num = max;
            scope.render.call(scope, num, max);
            if(max <= 1){return;}
            scope.customClick( num );
        });
        // Render
        this.render(cur, total);
    },
    /*
     *   creat page info
     *   @param  cur         index of page from 1
     *   @param  total       total page number from 1
     */
    render: function(cur, total){

        if (cur < 1)
            cur = 1;
        if (total < 1)
            total = 1;
        if (cur > total)
            cur = total;
        var html = [], pre, next, scope = this;
        // Total Page
        this.pagem.html( total );
        this.pagenum.max = total;

        if (cur === 1) {
            html.push('<a target="_self" class="pre-disabled" href="javascript:;"> </a>');
            html.push('<a target="_self" class="current" href="javascript:;">1</a>');
        }
        else {
            html.push('<a target="_self" class="pre" href="javascript:;" page="' + (cur - 1) + '"> </a>');
            html.push('<a target="_self" href="javascript:;" page="1">1</a>');
        }
        if (total > 1) {
            if (cur > 4 && total > 7)
                html.push('<a target="_self" class="omit" href="javascript:;">...</a>');
            // cur==1?
            if (cur < 3) {
                pre = 0;
                next = cur === 1 ? 5 : 4;
                if (cur + next > total)
                next = total - cur;
            }
            else if (cur === 3) {
                pre = 1;
                next = 3;
                if (cur + next > total)
                    next = total - cur;
            }
            else {
                pre = 2;
                next = 2;
                if (cur + next > total)
                    next = total - cur;
                pre = 4 - next;
                if (cur + 3 > total)
                    pre ++;
                if (cur - pre < 2)
                    pre = cur - 2;
            }

            for ( var i = pre; 0 < i; i-- )
                html.push('<a target="_self" href="#" page="' + (cur - i) + '">' + (cur - i) + '</a>');
            if ( cur > 1 )
                html.push('<a target="_self" class="current" href="javascript:;">' + cur + '</a>');
            for (var i = 1; i < next + 1; i++)
                html.push('<a target="_self" href="#" page="' + (cur + i) + '">' + (cur + i) + '</a>');

            if ( cur + next < total - 1 ) {
                html.push('<a target="_self" class="omit" href="javascript:;">...</a>');
                html.push('<a target="_self" href="#" page="' + total + '">' + total + '</a>');
            }
            if (cur + next === total - 1)
                html.push('<a target="_self" href="#" page="' + total + '">' + total + '</a>');
        }
        if (cur === total)
            html.push('<a target="_self" class="next-disabled" href="javascript:;">下一页</a>');
        else {
            html.push('<a target="_self" class="next" href="#" page="' + (cur + 1) + '">下一页</a>');
        }

        this.pagination.html(html.join(''));
        // Trigger onRender
        if (this.configs.onRender)
            this.configs.onRender.call(this);
        // Set Normal
        if ( this.pagenum.val() && this.pagenum.val() * 1 > total )
            this.pagenum.val(cur);
        $('a[page]', this.pagination).bind("click", function(e){

            e.preventDefault();
            var page = $(this).attr('page') * 1;
            scope.render(page, total);
            scope.customClick(page);
        });
    },
    /**
     * 自定义事件
     */
    customClick:function( page ){

    }
};

DAA.Paging = Paging;

})(jQuery, dance.at.alibaba);

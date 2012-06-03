
/**
 * 头部导航相关公用js.
 *
 * Author:  hustcer
 * Date:    2012-06-03   
 */



jQuery.namespace('dance.at.alibaba');             

jQuery(function($){

    var NS = dance.at.alibaba;

    // Begin Module Definition
    var module = NS.header = {
                    
        /**
         * 静态模块的初始化入口
         */
        init: function(){
        
            this._initUI();
        },
        /**
         * 模块的主要UI相关初始化
         */
        _initUI: function(){

            // console.log('init header...');
            $.use("util-storage",function(){

                /* 所有的操作都必须放在ready里面 */
                var STORE = jQuery.util.storage;
                STORE.ready(function(){
                    var dType = STORE.getItem('danceType')||'latin';
                    $('#dance-nav a.apply').attr('href', '/' + dType);
                    $('#dance-nav a.list').attr('href', '/list/' + dType);
                    $('#dance-nav a.manage').attr('href', '/man/' + dType);
                });
                
            });
            
        }
    };
    // End Module Definition
    
    /**
     * 对模块进行初始化。如果模块挂在命名空间下，则可以在外部进行模块初始化，在闭包内则不需要再执行init函数。
     */
    module.init();
});




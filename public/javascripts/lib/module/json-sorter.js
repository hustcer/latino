/*
 * Author: 	justin.maj
 * Date: 	20120215
*/
jQuery.namespace('json.array');             

jQuery(function($){

    var NS 		= json.array;
	
	// Begin Module Definition
    var module 	= NS.util = {
    	
		/**
		 * Json数组排序方法
		 * @param arrayData 需要排序的Json数组
		 * @param index 待比较排序的key
		 * @param order 大于0的时候升序，小于0 则降序
		 */
		sortOrder: function(arrayData, index, order){

			if(order > 0)
				return arrayData.sort(function(a, b){ 
					if (a[index] === b[index]) {
						return 0;
					}
					if( typeof a[index] === typeof b[index]){
						return a[index] > b[index] ? 1 : -1; 
					}
					return typeof a[index] > typeof b[index] ? 1 : -1; 
				});
			else
				return arrayData.sort(function(a, b){ 
					if (a[index] === b[index]) {
						return 0;
					}
					if( typeof a[index] === typeof b[index]){
						return a[index] > b[index] ? -1 : 1; 
					}
					return typeof a[index] > typeof b[index] ? -1 : 1; 
				});
		}

	} // End Module Definition
	
});
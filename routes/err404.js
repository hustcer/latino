
/**
 * GET 404 page.
 *
 * Author: 	justin.maj
 * Date: 	2012-1-19   
 */
exports.err404 = function(req, res){
	
    res.render('err404', {
        status: 404,
        title: 'Alibaba Latin Center',
        msg: 'I\'m Sorry!The File You Rquested was Not Found on This Server!'
    });
};

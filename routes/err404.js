
/*
 * GET 404 page.
 */
exports.err404 = function(req, res){
    res.render('err404', {
        status: 404,
        title: 'Express',
        msg: 'File Not Found!'
    });
};

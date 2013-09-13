
/**
 * GET and render markdown pages.
 *
 * Author: 	hustcer
 * Date: 	2012-05-22
 */

var fs          = require('fs'),
    md          = require('marked'),
    path        = require('path');

exports.mdrender= function(req, res){

    var markdownFile    = path.normalize(__dirname + '/../doc/' + req.params.md + '.md');

    // 对应的markdown文件不存在则重定向到404
    if (!fs.existsSync(markdownFile)){
        res.redirect('/err404');
        return;
    }

    // markdown文件存在则渲染该页面
    fs.readFile(markdownFile, 'utf8', function (err, data) {
        if (err) {
            console.error('[ERRO]----Failed reading file: ' + markdownFile);
            res.redirect('/err404');
        }

        var head = '<head><title>Alibaba舞蹈培训 - ' + req.params.md + '</title>' +
            '<link rel="stylesheet" href="/stylesheets/style.css"><link rel="stylesheet" href="/stylesheets/fdev-float.css"></head>';
        var html = head + '<body class="content markdown">' + md(data) + '</body>';

        res.send(html);
    });

};

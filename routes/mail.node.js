
/**
 * Mail sending page.
 *
 * Author:  hustcer
 * Date:    2012-1-19   
 */

var fs          = require('fs'),
    path        = require('path'),
    nodemailer  = require("nodemailer");

var smtpTransport   = null;

exports.mail = function(req, res){

    sendMail('hustcer@gmail.com', "toAddress", "mail content");

    res.render('mail', {
        title:   'Dance @ Alibaba',
        msg:     'Sending Mails'
    });
};

var initSmtpTransport = function(){

    var confFile = path.normalize(__dirname + '/../conf/conf.json');

    // 邮箱配置文件不存在则停止发邮件
    if ( !fs.existsSync(confFile) ){

        console.error('[ERRO]----Can not find email account config file ' + confFile + ', Stop mail sending...');
        return;
    }

    data  = JSON.parse(fs.readFileSync(confFile));

    // create reusable transport method (opens pool of SMTP connections)
    smtpTransport = nodemailer.createTransport("SMTP",{
        service : data.mailAuth.mailSupplier,
        auth: {
            user: data.mailAuth.email,
            pass: data.mailAuth.password
        }
    });

};

/*
 * 邮件发送通用方法
 * @param toAddress Send to email Address list, eg:"hello@hello.com, bye@bye.com"
 * @param title     The Mail Subject
 * @param msg       The Mail message content
 * FIXME: Hide auth informations
 */
var sendMail = exports.sendMail = function(toAddress, title, msg){

    if( smtpTransport === null ){
        initSmtpTransport();

        if( smtpTransport === null ){
            console.error('[ERRO]----Smtp transport init failed, stop mail sending...');
        }
        return false;
    }

    if(!toAddress){
        console.error('[ERRO]----Mail address empty, stop mail sending...');
    }

    // setup e-mail data with unicode symbols
    var mailOptions = {
        from    : "AlDanceCenter<danceCenter@gmail.com>",   // sender address
        to      : toAddress,                                // list of receivers
        subject : title,                                    // Subject line
        text    : msg,                                      // plaintext body
        html    : msg                                       // html body
    }

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.error('[ERRO]----' + error);
        }else{
            console.log("[INFO]----Mail message sent: " + response.message);
        }

        // if you don't want to use this transport object anymore, uncomment following line
        // smtpTransport.close(); 
        // shut down the connection pool, no more messages

    });

}


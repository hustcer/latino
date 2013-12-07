
/**
 * Get Mongo DB Collection Instance.
 *
 * Author:  hustcer
 * Date:    2012-05-27
 */
var db = require("../database/database.js").db;

exports.getCollection = function(req, res){

    switch (req.params.dType){

        case '':
        case 'latin':
            return db.collection('latin');
            break;

        case 'jazz':
            return db.collection('jazz');
            break;

        case 'hiphop':
            return db.collection('hiphop');
            break;

        default:
            return db.collection('latin');
            break;
    }

};

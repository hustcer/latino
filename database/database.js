/**
 * 数据持久化层
 */
var database = exports.database = {};
var db = exports.db = require('mongoskin').db('localhost:27017/latin');


database.mongoskinUsage = function(){

	// Update certain band
	bands.update({name:"Guns N' Roses"}, {'$pull':{dancers:'Matt Sorum'}}, function(err) {
	    if (err) throw err;
	    db.collection('bands').update({name:"Guns N' Roses"}, {'$push':{dancers:'Steven Adler'}}, function(err) {
	        if (err) throw err;
	        console.log('Updated!');
	    });
	});

	// Count all bands
	bands.count(function(err, count) {
	    console.log('There are ' + count + ' bands in the database');
	});

	// Count bands that satisfy certain conditions.
	bands.count({year:{$gte:1985}}, function(err, count) {
	    console.log(count + ' bands were formed in 1985 or later');
	});

	// Remove bands
	db.collection('bands').remove({name:'Velvet Revolver'}, function(err, result) {
	    if (!err) console.log('VR deleted!');
	});

}

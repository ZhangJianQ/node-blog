var Mongolass = require('mongolass');
var config = require('config-lite');

var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.User = mongolass.model('User', function(){
	name:{type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	sex:{type:'number'},
	resume:{type:'string'}
});

exports.User.index({name:1}, {unique:true}).exec()
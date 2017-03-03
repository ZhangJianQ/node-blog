var Mongolass = require('mongolass');
var config = require('config-lite');

var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

exports.Users = mongolass.model('Users', {
	name:{type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	gender:{type:'number'},
	bio:{type:'string'}
});

exports.Users.index({name:1}, {unique:true}).exec()
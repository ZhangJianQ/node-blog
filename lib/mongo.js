var Mongolass = require('mongolass');
var moment = require('moment');
var config = require('config-lite');
var objectIdToTimestamp = require('objectid-to-timestamp');

var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

mongolass.plugin('addCreatedAt', {
	afterFind:function(results){
		results.forEach(function(item){
			item.create_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
		})
		return results;
	},
	afterFindOne:function(result){
		if(result){
			result.create_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
		}
		return result;
	}
})

exports.Users = mongolass.model('Users', {	//用户表
	name:{type:'string'},
	password:{type:'string'},
	avatar:{type:'string'},
	gender:{type:'string'},
	bio:{type:'string'}
});

exports.Post = mongolass.model('Post',{	//文章表
	author:{type:Mongolass.Types.ObjectId},
	title:{type:'string'},
	content:{type:'string'},
	pv:{type:'number'}
})

exports.Comment = mongolass.model('Comment', {
	author:{type:Mongolass.Types.ObjectId},
	postId:{type:Mongolass.Types.ObjectId},
	content:{type:'string'}
})

exports.Users.index({name:1}, {unique:true}).exec();
exports.Post.index({author:1, _id:-1}).exec();
exports.Comment.index({postId:1, _id:1}).exec();
exports.Comment.index({author:1, _id:1}).exec();
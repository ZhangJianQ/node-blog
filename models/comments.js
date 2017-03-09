var marked = require('marked');
var Comment = require('../lib/mongo').Comment;

Comment.plugin('contentToHtml', {
	afterFind:function(comments){
		return comments.map(function(comment){
			comment.content = marked(comment.content);
			return comment;
		})
	}
});

module.exports = {
	create:function(comment){
		return Comment.create(comment).exec();
	},
	deleteComment:function(id, author){
		return Comment.remove({author:author, _id:id}).exec();	//添加author的目的是对删除做验证
	},
	deleteCommentByPostId:function(postId){
		return Comment.remove({postId:postId}).exec();
	},
	getComments:function(postId){
		return Comment.find({postId:postId})
		.populate({path:'author', model:'User'})	//???
		.sort({_id:1})
		.addCreatedAt().contentToHtml().exec();
	},
	getCommentCount:function(postId){
		return Comment.count({postId,postId}).exec();
	}
}
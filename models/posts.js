var Post = require('../lib/mongo').Post;
var marked = require('marked');
var CommentModel = require('./comments');

Post.plugin('contentHTML',{
	afterFind:function(posts){
		return posts.map(function(post){
			post.content = marked(post.content);
			return post;
		})
	},
	afterFindOne:function(post){
		if(post){
			post.content = marked(post.content);
		}
		return post;
	}
})

Post.plugin('addCommentsCount', {
	afterFind:function(posts){
		return Promise.all(posts.map(function(post){
			return CommentModel.getCommentCount(post._id).then(function(count){
				post.commentsCount = count;
				return post;
			})
		}))
	},
	afterFindOne:function(post){
		if(post){
			return CommentModel.getCommentCount(post._id).then(function(count){
				post.commentsCount = count;
				return post;
			})
		}
		return post;
	}
})

module.exports = {
	create:function(post){
		return Post.create(post).exec();
	},
	getPostById:function(id){	//通过id获取文章
		return Post.findOne({_id:id}).populate({path:'author', model:'User'})
		.addCreatedAt().addCommentsCount().contentHTML().exec()
	},
	getPosts:function(author){	//根据条件query字段查找文章
		var query = {};
		if(author)
			query.author = author
		return Post.find(query).populate({path:'author', model:'User'})
		.sort({_id:-1})
		.addCreatedAt().addCommentsCount()
		.contentHTML().exec();
	},
	addedPv:function(id){	//增加点击量
		return Post.update({_id:id}, {$inc:{pv:1}}).exec();
	},
	getOriginPostById:function(id){	//
		return Post.findOne({_id:id}).populate({path:'author', model:'User'})
		exec();
	},
	updatePost:function(id, author, data){
		return Post.update({author:author, _id:id}, {$set:data}).exec()
	},
	deletePost:function(id){
		return Post.remove({author:author, _id:id}).exec().then(function(res){
			if(res.result.ok&&res.result.n>0){
				return CommentModel.deleteCommentByPostId(id)
			}
		})
	}
}
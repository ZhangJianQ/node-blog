var Post = require('../lib/mongo').Post;
var marked = require('marked');

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

module.exports = {
	create:function(post){
		return Post.create(post).exec();
	},
	getPostById:function(id){
		return Post.findOne({_id:id}).populate({path:'author', model:'User'})
		.addCreatedAt().contentHTML().exec()
	},
	getPosts:function(author){
		var query = {};
		if(author)
			query.author = author
		return Post.find(query).populate({path:'author', model:'User'})
		.sort({_id:-1})
		.addCreatedAt()
		.contentHTML().exec();
	},
	addedPv:function(id){
		return Post.update({_id:id}, {$inc:{pv:1}}).exec();
	}
}
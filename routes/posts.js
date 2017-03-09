var express = require('express');
var router = express.Router();
var PostModel = require('../models/posts');
var CommentModel = require('../models/comments');

var checkLogin = require('../middlewares/check').checkLogin;

router.get('/', (req, res, next) => { //跳转到主页
    var author = req.query.author;
    PostModel.getPosts(author).then(function(posts){
    	res.render('posts', {
    		posts:posts
    	})
    }).catch(next)
});

router.post('/', (req, res, next) => { //跳转到主页
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    try {
        if (!title.length)
            throw new Error('enter title please');
        if (!content.length)
            throw new Error('enter content please');
    } catch (e) {
        req.flash('error', e.message);
        return res.redirect('back');
    }

    var post = {
        author: author,
        title: title,
        content: content,
        pv: 0
    };

    PostModel.create(post).then(function(result) {
        post = result.ops[0];
        req.flash('success', 'post success');
        res.redirect('/posts/' + post._id);
    }).catch(next)
});

router.get('/create', checkLogin, (req, res, next) => { //获取创建文章页面
    res.render('create')
})

router.post('/create', checkLogin, (req, res, next) => {    //创建文章
    var id = req.params.postId;

    Promise.all([PostModel.getPostById(id),PostModel.addedPv(id)])
    .then(function(result){
    	var post = result[0];
    	if(!post)
    		throw new Error('This article is not found')
    }).catch(next)
})

router.get('/:postId', (req, res, next) => {    //获取文章
    var postId = req.params.postId;

    Promise.all([
        PostModel.getPostById(postId),
        CommentModel.getComments(postId),
        PostModel.addedPv(postId)]).then(function(result){
            var post = result[0];
            var comments = result[1];
            if(!post)
                throw new Error('This article is not exit');

            res.render('post', {post:post, comments:comments})
        }).catch(next)
})

router.get('/:postId/edit', checkLogin, (req, res, next) => {   //编辑文章
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.getOriginPostById(postId).then(function(result){
            var post = result;
            if(!post)
                throw new Error('This article is not exit');
            if(author.toString()!==post.author._id.toString())
                throw new Error('permit not allow')
            res.render('edit', {post:post})
        }).catch(next)
})

router.post('/:postId/edit', checkLogin, (req, res, next) => {  //更新文章
    var postId = req.params.postId;
    var author = req.session.user._id;
    var title = req.fields.title;
    var content = req.fields.content;

    PostModel.updatePost(postId, author, {title:title, content:content})
    .then(function(){
        req.flash('success', 'update successfully');
        res.redirect('/posts/'+postId)
    }).catch(next);
})

router.get('/:postId/remove', checkLogin, (req, res, next) => { //删除文章
    var postId = req.params.postId;
    var author = req.session.user._id;

    PostModel.deletePost(postId)
    .then(function(){
        req.flash('success', 'delete successfully');
        res.redirect('/posts')
    }).catch(next);
})

router.post('/:postId/comment', checkLogin, (req, res, next) => {   //留言
    var author = req.session.user._id;
    var postId =req.params.postId;
    var content = req.fields.content;
    var comment = {
        author:author,
        postId:postId,
        content:content
    }

    CommentModel.create(comment).then(function(){
        req.flash('success', 'create comment success');
        res.redirect('back');
    }).catch(next)
})

router.get('/:postId/comment/:commentId/remove', checkLogin, (req, res, next) => {
    var author = req.session.user._id;
    var commentId =req.params.commentId;

    CommentModel.deleteComment(commentId, author).then(function(){
        req.flash('success', 'delete comment successfully!');
        res.redirect('back');
    }).catch(next)
})

module.exports = router;

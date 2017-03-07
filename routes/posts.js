var express = require('express');
var router = express.Router();
var PostModel = require('../models/posts');

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

router.get('/create', checkLogin, (req, res, next) => {
    res.render('create')
})

router.post('/create', checkLogin, (req, res, next) => {
    var id = req.params.postId;

    Promise.all([PostModel.getPostById(id),PostModel.incPv(id)])
    .then(function(result){
    	var post = result[0];
    	if(!post)
    		throw new Error('This article is not found')
    }).catch(next)
})

router.get('/:postId', (req, res, next) => {
    res.send(req.flash())
})

router.get('/:postId/edit', checkLogin, (req, res, next) => {
    res.send(req.flash())
})

router.post('/:postId/edit', checkLogin, (req, res, next) => {
    res.send(req.flash())
})

router.get('/:postId/remove', checkLogin, (req, res, next) => {
    res.send(req.flash())
})

router.post('/:postId/comment', checkLogin, (req, res, next) => {
    res.send(req.flash())
})

router.get('/:postId/comment/:commentId/remove', checkLogin, (req, res, next) => {
    res.send(req.flash())
})

module.exports = router;

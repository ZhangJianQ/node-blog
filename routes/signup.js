var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/user')
var checkNotLogin = require('../middlewares/check').checkNotLogin;

//渲染注册页面
router.get('/', checkNotLogin, (req, res, next) => {
    res.render('signup')
})

//获取注册表单处理数据
router.post('/', checkNotLogin, (req, res, next) => {
    var name = req.fields.name,
        gender = req.fields.gender,
        bio = req.fields.bio,
        avatar = req.files.avatar.path.split(path.sep).pop(),   //获取头像req.files
        password = req.fields.password,
        repassword = req.fields.repassword;

    //表单字段验证
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('name is limited to 1 - 10 words'); //会被flash捕获
        }
        if (['-1', '0', '1'].indexOf(gender) === -1) {
            throw new Error('sex is limited betowen -1、0 或 1');
        }
        if (!(bio.length >= 1 && bio.length <= 30)) {
            throw new Error('bio is limited to 1 - 30 words');
        }
        if (!req.files.avatar.name) {
            throw new Error('please upload your avatar');
        }
        if (password.length < 6) {
            throw new Error('repassword is limited upper 6 words');
        }
        if (password !== repassword) {
            throw new Error('repeat password is not match password');
        }
    }catch(e){
    	fs.unlink(req.files.avatar.path);  //删除文件，因为没有通过字段验证，不保存上传的文件
    	req.flash('error', e.message); //返回错误消息
    	return res.redirect('/signup');
    }

    var user = {    //创建传入mongo的数据对象
    	name:name,
    	password:sha1(password),
    	bio:bio,
    	gender:gender,
    	avatar:avatar
    }

    UserModel.create(user).then(function(result){   //调用models/user模块插入注册信息
    	user = result.ops[0];
    	delete user.password;
    	req.session.user = user;   //将用户信息写入session，用于登录后操作
    	req.flash('success','sign up success');    //显示通知
    	res.redirect('/posts')
    }).catch(function(e){   //注册失败删除头像文件
    	fs.unlink(req.files.avatar.path);
    	if(e.message.match('E11000 duplicate key')){
    		req.flash('error', 'name has been signed up');    //用户名被占，之后可以做成异步的
    		return res.redirect('/signup')
    	}
    	next(e)
    })
})

module.exports = router;

var express = require('express');
var router = express.Router();
var checkNotLogin = require('../middlewares/check').checkNotLogin;

router.get('/', checkNotLogin, (req, res, next)=>{
	res.render('signup')
})

router.post('/', checkNotLogin, (req, res, next)=>{
	res.send(req.flash())
})

module.exports = router;
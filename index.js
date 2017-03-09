//设置一个服务器请求的回调函数
// var http = require('http');
// http.createServer(function(req, res){
// 	res.statusCode = 200,
// 	res.setHeader('Content-Type','text/plain')
// 	res.end('Hello World\n');
// }).listen(8000,'127.0.0.1',function(){
// 	console.log('Server running at http://127.0.0.1:8000')
// })

// var circle = require('./circle.js');
// console.log(circle().circumference(4));

var path = require('path');
var express = require('express');
var session = require('express-session');
var mongostore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');	//routes/index.js
var pkg = require('./package');	//package.json
var formidable = require('express-formidable');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();
const port = config.port;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	//设置模板引擎

//设置静态资源存放路径
app.use(express.static(__dirname+'/public', {
	etag:true	//开启etag
}))

//设置路由
app.use(session({
	name:config.session.key,
	secret:config.session.secret,
	resave:true,
	saveUninitialized:false,
	cookie:{
		maxAge:config.session.maxAge
	},
	store:new mongostore({
		url:config.mongodb	//将session存放到配置表里的数据库
	})
}));

app.use(flash());

app.use(formidable({
	uploadDir:path.join(__dirname, 'public/img'),
	keepExtensions:true
}))

app.locals.blog={
	title:pkg.name,
	description:pkg.description
}

app.use(function(req, res, next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next()
})

app.use(expressWinston.logger({
	transports:[
	new (winston.transports.Console)({
		json:true,
		colorize:true
	}), new winston.transports.File({
		filename:'logs/success.log'
	})]
}))

routes(app);

app.use(expressWinston.errorLogger({
	transports:[
	new winston.transports.Console({
		json:true,
		colorize:true
	}),new winston.transports.File({
		filename:'logs/error.log'
	})]
}))

app.listen(config.port, function(){
	console.log('listening on port ${port}')
})
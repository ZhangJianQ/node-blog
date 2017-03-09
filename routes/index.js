module.exports=function(app){
	app.get('/', (req, res)=>{
		res.redirect('/posts');
	});

	app.use('/signup', require('./signup'));	//用中间件处理路由
	app.use('/signin', require('./signin'));
	app.use('/signout', require('./signout'));
	app.use('/posts', require('./posts'));
	app.use(function(req, res){	//404页面
		console.log(res.headersSent)
		if(!res.headersSent){
			res.status(404).render('404')
		}
	});

	app.use(function(err, req, res, next){	//处理错误信息
		res.render('error', {
			error:err
		})
	})
}
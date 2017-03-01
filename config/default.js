module.exports ={
	port:3000,
	session:{
		secret:'myblog',
		key:'myblog',
		maxAge:2592000000	//毫秒数，30天
	},
	mongodb:'mongodb://localhost:27017/db'	//数据库文件位置
}
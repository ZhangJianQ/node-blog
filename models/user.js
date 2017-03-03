var Users = require('../lib/mongo').Users;

module.exports = {
	create:function create(user){
		return Users.create(user).exec();
	}
}


var Users = require('../lib/mongo').Users;

module.exports = {
	create:function create(user){
		return Users.create(user).exec();
	},
	getUserByName:function(name){
		return Users.findOne({name:name}).addCreatedAt().exec()
	}
}


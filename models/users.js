//users.js
var mongoose =require('mongoose');
var db=require('./db');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(db);
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var UserSchema = new Schema({
	user_no: Number,
	pw: String,
	email: String,
	nickname: String,
	facebook_token: String,
	facebook_name: String,
	facebook_id: String,
	kakao_token: String,
	kakao_name: String,
	kakao_id: String,
	stamp: Number,
	userpic_url: String,
	userpic_thumbnail_url: String
	//Favorite_hairshop : Array(hairshop_no)
});
UserSchema.plugin(autoIncrement.plugin, { model: 'User', field: 'user_no', startAt: 1, incrementBy: 1});
var UserModel=db.model('User', UserSchema);

module.exports = UserModel;
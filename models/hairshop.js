//users.js
var mongoose =require('mongoose');
var db=require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var hairshopSchema = new Schema({
	shop_no: Number,
	shop_name: String,
	address: String,
	station: String,
	business_hour: String,
	tel: String,
	price_info: [{cut: String, color: String, perm: String}],
	shoppic_url: String,
	shoppic_thumbnail_url: String,
	hairpics_url: String[],
	hairpics_thumbnail_url: String[]
	//Review: [Review]
});

var hairshopModel=db.model('hairshop', hairshopSchema);

module.exports = UserModel;
//reservation.js
var mongoose =require('mongoose');
var db=require('./db');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var reservationSchema = new Schema({
user_no: Number,
hairshop_no: Number,
res_date: Date,
reservation_no:Number
});

var ReservationModel=db.model('reservation', reservationSchema);

module.exports = UserModel;
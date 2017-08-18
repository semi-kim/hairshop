// db.js
//mymongo -> test -> 콜렉션 -> 유저스
var mongoose= require('mongoose');
var uri='mongodb://localhost/test'; //mymongo
var options={
	server:{poolSize: 100 }
}
var db=mongoose.createConnection(uri,options);

db.once('open',function(){//한번만 실행
	console.log("MongoDB connected successfully");
});

db.on('error',function(err){
	if(err) console.log('db err=',err);
});

module.exports=db;
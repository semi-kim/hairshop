var express = require('express');
var router = express.Router();
var UserModel=require('../models/users');
var bcrypt=require('bcrypt-node');
/* GET users listing. */
//http://localhost:3000/users/         유저스 뒤에 슬래쉬가 밑의 슬래쉬
router.get('/', function(req, res, next) { //     /<-현재위치
	var user_id = req.session.user_id;
	console.log('user_id=',user_id);//처음(undefined)에는 없을 것이고 두번째(hong)는 있을 것이다
	//
  res.render('index',{title:"회원 관리", user_id:user_id});
});

router.get('/login',function(req,res,next){
	res.render('/',{title:"로그인"});
});

router.post('/login',function(req,res,next){
	console.log('req.body=',req.body); //콜솔창에 찍히고
	var user_id=req.body.id;
	var user_pw=req.body.pw;
	UserModel.findOne({nickname:user_id},function(err,doc){
		if(err) console.log('err', err);
		console.log('doc=',doc);
		var aaa = bcrypt.compareSync(user_pw, doc.pw);
		if(aaa){
			req.session.nickname=user_id;//req.sessoin.내가넣고싶은 이름
			//res.send('<script>alert("로그인 되었습니다!!!");location.href="/users/"</script>');
			//res.send('<script>location.href="/users/imsi"</script>');
			res.json({
				"success_code" : 1,
				"user_no":doc.user_no,
				"email":doc.email,
				"nickname":doc.nickname
			});// 웹에 찍힘
		} else {
			//res.send('<script>alert("아이디나 비밀번호가 틀려서 되돌아갑니다!!!");history.back();</script>');
			res.json({"success_code" : 0});
		}
	});
});

router.get('/logout',function(req,res,next){
	req.session.destroy(function(err){//세션은 두컴퓨터 연결
		if(err) console.log('err',err);
		console.log('logout req.session=',req.session);
		//res.send('<script>alert("로그아웃 되었습니다!!!");location.href="/users/"</script>');
		res.json({"success_code" : 1});
	});
});

//로그인 한 상태에서만 올수 있는 페이지
// router.get('/imsi',function(req,res,next){
// 	var user_id=req.session.user_id;
// 	if(user_id){
// 		res.send("서비스를 이용할 수 있습니다!!!");
// 	}else{
// 		res.send('<script>alert("로그인을 먼저 해주세요!!!");location.href="/users/"</script>');
// 	}
// });

router.get('/imsi',function(req,res,next){
	var user_id=req.session.user_id;
	if(user_id){
		res.send('<script>alert("서비스를 이용할 수 있습니다!!!");</script>');
	}else{
		res.send('<script>alert("로그인을 먼저 해주세요!!!");location.href="/"</script>');
	}
	res.render('users/index',{title:"회원 관리", user_id:user_id});
});

router.get('/join',function(req,res,next){
	res.render('users/joinform',{title:"회원 가입"});
});

router.post('/join',function(req,res,next){
	console.log('req.body=',req.body);
	var email = req.body.email;
	var pw = req.body.pw;

	 	UserModel.findOne({email:email},function(err,doc){
	 				if(err) res.json('join err=',err);
	 				console.log('join doc=',doc);
	 				if(doc)
	 					res.json({"success_code":"이메일중복"}); //중복일때
	 				else{
	 					var hash=bcrypt.hashSync(pw);
	 					var nickname = email.split('@')[0];
	 					var data = {
	 						pw:hash,
	 						email:email,
	 						nickname:nickname,
	 						stamp:1
	 					};
	 					var user = new UserModel(data);
	 					user.save(function(err,doc){
	 						console.log('doc=',doc);
	 						// res.redirect('/');
	 						res.json({success_code:1});
	 					 });
	 				}
	 			});
});

// router.post('/duplicate_email',function(req,res,next){ //회원가입 할때 디비에 저장되어 있을 때
// 	console.log('req.body=',req.body);
// 	var email = req.body.email;
//  	UserModel.findOne({email:email},function(err,doc){
//  				if(err) console.log('joinsave err=',err);
//  				console.log('joinsave doc=',doc);
//  				if(doc)
//  					res.json({success_code:1}); //중복일시
//  				else
//  					res.json({success_code:0});
//  			});
//  });



router.post('/facebook',function(req,res,next){//페이스북이 디비에 저장되지 않을 때
  var FB=require('fb');
  var token = req.body.facebooktoken;
  // var token="EAAGoHzBBIocBAOOmT9sVCmByhG8Xfuzlm1IQxZB0QTtJ7x79o3ZALAruEUO71hHZCZAYO6zTEGMzRWveqXZCabuu8VkSsQQy5oSmdNEvU2AjTK3FFvZBH4us6ZBgTsI0oZCIIsSpoemNVE2AyEXjCjASZCaxbKDs5dV0ZD"; //토큰은 안드가 준다
  FB.setAccessToken(token);
  FB.api('me',function(profile){
		console.log('profile=', profile);
		// 사용자 정보에 token과 profile을 저장한다.

		var data = {
			facebook_token:token,
			facebook_name: profile.name,
			facebook_id:profile.id,
			stamp:1
		};

		var user = new UserModel(data);
		user.save(function(err,doc){
			console.log('doc=',doc);
			// res.redirect('/');
			res.json({profile:profile});
		 });
	});
});


router.post('/save_facebook', function(req, res, next){//저장되있을때
	var facebook_token = req.body.facebook_token;
	UserModel.findOne({facebook_token:facebook_token},function(err,doc){
				if(err) console.log('facebook err=',err);
				console.log('loginfacebook doc=',doc);
				if(doc) {
					req.session.facebook_token = doc.facebook_token;
					res.json({success_code:1});
				}
				else
					res.json({success_code:0});
			});
});

// 카톡 로그인 구현
//tgo0LEWDwnQ9Ugeg9gBldhksg5eiqb9ShTig2Qo8BhkAAAFd8v8FPw
//  카톡/페이스북 토큰으로 사진띄우기


router.get('/kakao',function(req,res,next){ //카카오톡 서버 처음(db저장안되있을때)
  var KT=require('kt');
  var token = req.body.kakao;
  // var token="tgo0LEWDwnQ9Ugeg9gBldhksg5eiqb9ShTig2Qo8BhkAAAFd8v8FPw"; //토큰은 안드가 준다
  FB.setAccessToken(token);
    FB.api('me',function(profile){
  		console.log('profile=', profile);
  		// 사용자 정보에 token과 profile을 저장한다.

  		var data = {
  			kakao_token:token,
  			kakao_name: profile.name,
  			kakao_id:profile.id,
  			stamp:1
  		};

  		var user = new UserModel(data);
  		user.save(function(err,doc){
  			console.log('doc=',doc);
  			// res.redirect('/');
  			res.json({profile:profile});
  		 });
  	});
  });


router.get('/update', function(req,res,next){
	var user_id =req.session.user_id;
	if(user_id){
		UserModel.findOne({user_id:user_id},function(err,doc){
			if(err) console.log('get update err=',err);
			console.log('get update doc=',doc);
			res.render('users/updateform',{title:"회원 정보 수정",doc:doc});
		});
	}else{
		res.send('<script>alert("로그인을 먼저 해주세요!!!");location.href="/users/"</script>');
	}
});

router.post('/update',function(req,res,next){
	console.log('req.body=',req.body);
	const user_id=req.body.id;
	const user_pw=req.body.pw;
	const user_email=req.body.email;
	UserModel.update({user_id:user_id, user_pw:user_pw}, {user_email:user_email},
			function(err,doc){
				if(err) console.log('err',err);
				console.log('post update doc=',doc);
				if(doc.n==1){
					res.redirect('/users/');
				}
				else{
					res.send('<script>alert("아이디나 비밀번호가 틀려서 되돌아갑니다!!!");history.back();</script>');
				}
		});
});

//회원 탈되
router.get('/delete',function(req,res,next){
	if(!req.session.user_id){
		return res.send('<script>alert("로그인을 먼저 해주세요!!!");location.href="/users/"</script>');
	}
res.render('users/deleteform',{title:"회원틸퇴"});
});

router.post('/delete',function(req,res,next)
{
	console.log('req.body=',req.body);
	var user_id=req.session.user_id;
	var user_pw=req.body.pw;
	UserModel.update({user_id:user_id,user_pw:user_pw},{del_yn:"Y"},function(err,doc)
	{
		if(err) console.log('post delete err=',err);
		console.log('post delete doc=',doc);
		if(doc.n==1)
		{
			req.session.destroy(function(err)
			{//세션은 두컴퓨터 연결
				if(err) console.log('err',err);
				res.send('<script>alert("탈퇴 완료 후  로그아웃 되었습니다!!!");location.href="/users/"</script>');
			});
		}
		else{
			res.send('<script>alert("아이디나 비밀번호가 틀려서 되돌아갑니다!!!");history.back();</script>');
		}
	});
});

module.exports = router;


const express=require('express');
//引入连接池对象
const pool=require('../pool.js');
const bodyParser=require('body-parser');
//创建路由器对象
var router=express.Router();
//使用body-parser中间件
router.use(bodyParser.urlencoded({extended:false}));

router.post('/list',function(req,res){
	var obj=req.body;
	console.log(obj);
	//验证数据是否为空
	if(obj.title===''){
		res.send({code:401,msg:'title required'});
		//阻止往后执行
		return;
		}
		if(obj.price===''){
		res.send({code:402,msg:'price required'});
		//阻止往后执行
		return;
		}
		if(obj.lid===''){
		res.send({code:402,msg:'price required'});
		//阻止往后执行
		return;
		}
		//执行SQL语句
		pool.query('INSERT INTO xz_laptop SET ?',[obj],function(err,result){
			if(err)throw(err);
			//console.log(result);
			//如果注册成功
	  //{code:200,msg:'register suc'}
	  if (result.affectedRows>0){
		  res.send({code:200,msg:'register suc'});
		}
	
      
	  });
		});


//用户登录
router.post('/login',function(req,res){
	var str=req.body;
	console.log(str);
	if (!str.uname){
		res.send({code:401,msg:'uname required'});
		return;
	}
	if (!str.upwd){
		res.send({code:402,msg:'upwd required'});
		return;
	}
	//查找用户名和密码同时满足的数据
	pool.query('SELECT *FROM xz_user WHERE uname=? AND upwd=?',[str.uname,str.upwd],function(err,result){
		if(err)throw err;
		if (result.length>0){
		res.send({code:200,msg:'login suc'});
		}else{
			res.send({code:301,msg:'login err'});
		}
	})
		
});


//检索 ，查询数据
router.get('/detail',function(req,res){
	var obj=req.query;
	//console.log(obj);
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
		return;
	}
	pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err)throw err;
		console.log(result);
		//判断是否检索到用户，如果检索到，
		//把该用户的对象响应到浏览器，否则响应检索不到
		if(result.length>0){
			res.send(result[0]);
		}else{
			res.send({code:301,msg:'can not found'});
		}
	});
});


//修改 数据
router.get('/update',function(req,res){
	var obj=req.query;
	//console.log(obj);
	//遍历对象，获取每个属性值(通过遍历来批量验证是否为空)
	var i=400;
	for(var key in obj){
		i++;
         //console.log(key,obj[key]);
		 //如果属性值为空，则提示属性名是必须的
		 if(!obj[key]){
			 res.send({code:i,msg:key+' required'});
			 return;
		 }
	}
	pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
		if(err)throw err;
        //console.log(result);
		if (result.affectedRows>0){
			res.send({code:200,msg:'update success'});
		}else{
			res.send({code:401,msg:'update err'});
		};
	});
});


//用户列表 页码 查询
router.get('/list',function(req,res){
	var obj=req.query;
     console.log(obj);
	 var pno=obj.pno;
	 var size=obj.size;
	 if(!pno)pno=1;
	 if(!size)size=3;
	 pno=parseInt(pno);
	 size=parseInt(size);

     var start=(pno-1)*size;
	 var count=size;

	pool.query('SELECT * FROM xz_user Limit ?,?',[start,count],function(err,result){
		if (err)throw err;
		//console.log(result);直接send就可以，要显示在浏览器的内容
		res.send(result);
	});
});

//删除用户的列
router.get('/delete',function(req,res){
	var obj=req.query;
	console.log(obj);
	if(!obj.uid){
		res.send({code:401,msg:'uid required'});
		return;
	}
	pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
		if(err)throw err;
		//console.log(result);
		if (result.affectedRows>0){
			res.send({code:200,msg:'delete success'});
		}else{
			res.send({code:401,msg:'delete err'});
		}
	});
});



//导出路由器对象
module.exports=router;

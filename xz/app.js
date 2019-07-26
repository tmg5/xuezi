/*练习
创建web服务器，托管静态资源到public目录，创建文件 user_reg.html，
写入登录界面，用户、密码、邮箱、电话、点击提交*/
const express=require('express');

//引入用户路由器
const userRouter=require('./routes/user.js');//user.js中js可以省略
 var app=express();
app.listen(8080);

//引入商品路由器
const laptopRouter=require('./routes/product.js');
 





//托管静态资源到public目录
app.use(express.static('./public'));


//使用路由器，挂载到服务器/user下
app.use('/user',userRouter);
app.use('/product',laptopRouter);

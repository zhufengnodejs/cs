let express = require('express');
let cookieParser = require('cookie-parser');
let app = express();
app.use(cookieParser());
let sessions = {};
const SESSION_KEY = 'connect.sid';
//当客户端通过get方法访问/路径 的时候
app.get('/', function (req, res) {
    //拿到客户端发过的卡号
    let sessionId = req.cookies[SESSION_KEY];
    if (sessionId) {
        //取到这个卡号对应的sessionObj对象
        let sessionObj = sessions[sessionId];
        if (sessionObj) {
            sessionObj.balance -= 10;
            res.send(`欢迎你老顾客，余额${sessionObj.balance}`);
        } else {
            genId();
        }
    } else {
        genId();
    }
    function genId() {
        //生成一个卡号 一定要是唯一，不容易被猜到的
        let sessionId = Date.now() + Math.random() + '';
        //在服务器端开辟一块内存，记录此卡号对应的信息
        sessions[sessionId] = { balance: 100, name: req.query.name }; //session对象
        //把卡号通过cookie发给客户端
        res.cookie(SESSION_KEY, sessionId);
        res.send(`欢迎你新顾客，送你一张卡，余额100`);
    }

});
app.listen(8080);
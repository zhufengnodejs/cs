let express = require('express');
let session = require('express-session');
let app = express();
//当你使用了session中间件之后，会在请求对象上多一个req.session
//Error: secret option required for sessions
//resave
//saveUninitialized
app.use(session({
    name: 'sid',//指定向客户端发送的cookie的ID
    secret: 'zfpx',
    genid() {
        return Date.now() + '';
    },
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600 * 1000
    }
}));
app.get('/visit', function (req, res) {
    let visit = req.session.visit;
    if (visit) {
        visit += 1;
    } else {
        visit = 1;
    }
    req.session.visit = visit;
    res.send(`这是你的第${req.session.visit}次访问`);
});
app.listen(8080);
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
const session = require('express-session');
//const RedisStore = require('./connect-redis')(session);
//我们自己实现一个模块，把session数据放在文件系统里
//const FileStore = require('./connect-file')(session);
let app = express();
app.use(session({
    secret: 'zfpx',
    resave: true,
    saveUninitialized: true,
    //store: new FileStore({ dir: path.resolve(__dirname, 'sessions') })
    // 指定把会话数据放在哪个地方
    // store: new RedisStore({
    //     host: 'localhost',
    //     port: 6379
    // })
}));
//req.body = {username:xx,password:yy};
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
let users = [];
app.get('/reg', function (req, res) {
    res.render('reg', { title: '注册' });
});
app.post('/reg', function (req, res) {
    let user = req.body;
    users.push(user);
    res.redirect('/login');
});
app.get('/login', function (req, res) {
    res.render('login', { title: '登录' });
});
app.post('/login', function (req, res) {
    let user = req.body;
    let oldUser = users.find(item => user.username == item.username && user.password == item.password);
    if (oldUser) {
        req.session.user = oldUser;//把当前登录成功的用户写入session
        res.redirect('/user');
    } else {
        res.redirect('back');
    }
});
function checkUser(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}
app.get('/user', checkUser, function (req, res) {
    res.render('user', { username: req.session.user.username, title: '用户中心' });
});
app.get('/logout', function (req, res) {
    delete req.session.user;
    res.redirect('/login');
});
app.listen(8080);
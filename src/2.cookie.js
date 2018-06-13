let express = require('express');
let cookieParser = require('./cookie-parser');
let app = express();
app.use(cookieParser());
app.use(function (req, res, next) {
    res.cookie = function (key, val, options) {
        //Set-Cookie:name=zfpx; Path=/; HttpOnly
        let pairs = [`${key}=${encodeURIComponent(val)}`];//["name=zfpx"]
        if (options.domain) {
            pairs.push(`Domain=${options.domain}`);
        }
        if (options.path) {
            pairs.push(`Path=${options.path}`);
        }
        if (options.expires) {
            pairs.push(`Expires=${options.expires.toUTCString()}`);
        }
        if (options.maxAge) {
            pairs.push(`Max-Age=${options.maxAge}`);
        }
        if (options.httpOnly) {
            pairs.push(`HttpOnly=true`);
        }
        let cookie = pairs.join('; ');
        res.setHeader('Set-Cookie', cookie);
    }
    next();
});
// res.cookie
app.get('/write', function (req, res) {
    //res.cookie('name', 'zfpx');// res.setHeader('Set-Cookie','name=zfpx');
    //domain域名 用来指定此cookie在哪些域名下可以发送给服务器
    //res.cookie('name', 'zfpx', { domain: 'a.zfpx.cn' });

    //路径 path 指定了当向哪些路径发请求的时候才会带上此cookie
    //res.cookie('name', 'zfpx', { path: '/read' });

    //res.cookie('name', 'zfpx', { expires: new Date(Date.now() + 10 * 1000) });
    //res.cookie('name', 'zfpx', { maxAge: 10 * 1000 });

    res.cookie('name', 'zfpx', { httpOnly: true });
    res.end('ok');
});
app.get('/read', function (req, res) {
    let cookies = req.cookies;
    res.end(JSON.stringify(cookies));//name=zfpx; age=8  {name:'zfpx',age:8}
});
app.get('/read2', function (req, res) {
    let cookies = req.cookies;
    res.end(JSON.stringify(cookies));//name=zfpx; age=8  {name:'zfpx',age:8}
});
app.listen(8080);
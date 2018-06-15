//案例 统计某个客户端访问服务器的次数
let express = require('express');
let querystring = require('querystring');
//let cookieParser = require('./cookie-parser');
let app = express();
function signed(val, secret) {
    return 's:' + val + '.' + require('crypto')
        .createHmac('sha256', secret)
        .update(val)
        .digest('base64')
        .replace(/\=+$/, '');
}
function unsign(val, secret) {//val还是encode之后的值
    let value = val.slice(2, val.indexOf('.'));// s:100.xxxxxx
    //signed的值是没有编码的 ，包含+的
    return signed(value, secret) == val ? value : false;
}
function cookieParser(secret) {
    return function (req, res, next) {
        req.secret = secret;
        let cookie = req.headers.cookie;// name=s:9.xxxxxxxxxxxxx
        if (cookie) {
            //这是的cookies 拿到的是签名后的值
            let cookies = querystring.parse(cookie, '; ');//{name:'s:9.xxxxxxxxxxxxx'}
            let signedCookies = {};
            if (secret) {//{name:9}
                for (let key in cookies) {
                    signedCookies[key] = unsign(cookies[key], secret);
                }
            }
            req.signedCookies = signedCookies;
            req.cookies = cookies;
            next();
        } else {
            req.cookies = req.signedCookies = {};
            next();
        }
    }
}

//指定用来对cookie进行签名的秘钥
app.use(cookieParser('zfpx'))
app.use(function (req, res, next) {
    res.cookie = function (key, val, options) {
        // req.res  res.req
        //Set-Cookie:name=zfpx; Path=/; HttpOnly
        let pairs = [`${key}=${encodeURIComponent(signed(String(val), this.req.secret))}`];//["name=zfpx"]
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

app.get('/visit', function (req, res) {
    let visit = req.signedCookies.visit;
    if (visit) {
        visit = isNaN(visit) ? 0 : Number(visit) + 1;
    } else {
        visit = 1;
    }
    //this.req.secret
    res.cookie('visit', String(visit), { signed: true });
    res.send(`${visit}`);
});
app.listen(8080);
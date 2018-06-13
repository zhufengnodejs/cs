//案例 统计某个客户端访问服务器的次数
let express = require('express');
let querystring = require('querystring');
//let cookieParser = require('./cookie-parser');
let app = express();
function signed(val, secret) {
    return 's:' + val + '.' + require('crypto')
        .createHmac('sha256', secret)
        .update(val).digest('base64')
        .replace(/\=+$/, '');
}
function unsign(val, secret) {//val还是encode之后的值
    let value = val.slice(2, val.indexOf('.'));// "1"
    //signed的值是没有编码的 ，包含+的
    return signed(value, secret) == val ? value : false;
}
function cookieParser(secret) {
    return function (req, res, next) {
        req.secret = secret;
        let cookie = req.headers.cookie;// name=s:9.xxxxxxxxxxxxx
        if (cookie) {
            let cookies = querystring.parse(cookie, '; ');//{name:'s:9.xxxxxxxxxxxxx'}
            let signedCookies = {};
            if (secret) {//{name:9}
                let values = cookie.split('; ');
                for (let i = 0; i < values.length; i++) {
                    let value = values[i];
                    let [k, v] = value.split('=');//v原始的值
                    signedCookies[k] = unsign(v, secret);//v 的值还是encode之后的值
                }
                req.signedCookies = signedCookies;
            }
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
        //Set-Cookie:name=zfpx; Path=/; HttpOnly
        let pairs = [`${key}=${signed(String(val), this.req.secret)}`];//["name=zfpx"]
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
    res.cookie('visit', visit, { signed: true });
    res.send(`${visit}`);
});
app.listen(8080);
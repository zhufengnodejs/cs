let querystring = require('querystring');
module.exports = function (secret) {
    return function (req, res, next) {
        req.secret = secret;
        let cookie = req.headers.cookie;// name=s:9.xxxxxxxxxxxxx
        if (cookie) {
            let cookies = querystring.parse(cookie, '; ');//{name:'s:9.xxxxxxxxxxxxx'}
            
            next();
        } else {
            req.cookies = {};
            next();
        }
    }
}
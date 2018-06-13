let http = require('http');
let server = http.createServer(function (req, res) {
    if (req.url == '/write') {
        res.setHeader('Set-Cookie', "name=zfpx");
        res.end('Write Ok');
    } else if (req.url == '/read') {
        let cookie = req.headers.cookie;
        res.end(cookie);
    } else {
        res.end('NOT FOUND');
    }
});
server.listen(8080);
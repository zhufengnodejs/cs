let util = require('util');
let redis = require('redis');

function createRedisStore(session) {
    //Store类是所有的自定义存储的基类
    let Store = session.Store;
    util.inherits(RedisStore, Store);
    //此目录 存放着所有的会话对象，每一个会放对象都是一个json文件
    function RedisStore(options = {}) {
        this.client = redis.createClient(options.port || 6379, options.host || 'localhost');
    }
    //通过sessionId保存session到文件中去
    RedisStore.prototype.set = function (sid, session, callback) {
        this.client.set(sid, JSON.stringify(session), callback);
    }
    //通过sessionId获取文件系统中存放的session对象
    RedisStore.prototype.get = function (sid, callback) {
        this.client.get(sid, function (err, data) {
            if (err) callback(err);
            callback(err, JSON.parse(data));
        });
    }
    RedisStore.prototype.destroy = function (sid, callback) {
        this.client.unset(sid, callback);
    }
    return RedisStore;
}

module.exports = createRedisStore;
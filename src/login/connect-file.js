let util = require('util');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
function createFileStore(session) {
    //Store类是所有的自定义存储的基类
    let Store = session.Store;
    util.inherits(FileStore, Store);
    //此目录 存放着所有的会话对象，每一个会放对象都是一个json文件
    function FileStore(options = {}) {
        let { dir = path.resolve(__dirname, 'session') } = options;
        this.dir = dir;
        mkdirp(this.dir);//级联创建文件
    }
    //通过sessionId拿到对应的文件名
    FileStore.prototype.resolve = function (sid) {
        return path.resolve(this.dir, `${sid}.json`);
    }
    //通过sessionId保存session到文件中去
    FileStore.prototype.set = function (sid, session, callback) {
        fs.writeFile(this.resolve(sid), JSON.stringify(session), callback);
    }
    //通过sessionId获取文件系统中存放的session对象
    FileStore.prototype.get = function (sid, callback) {
        fs.readFile(this.resolve(sid), 'utf8', function (err, data) {
            if (err) callback(err);
            else callback(err, JSON.parse(data));
        });
    }
    FileStore.prototype.destroy = function (sid, callback) {
        fs.unlink(this.resolve(sid), callback);
    }
    return FileStore;
}

module.exports = createFileStore;
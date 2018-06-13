//encodeURIComponent('珠峰')
//"%E7%8F%A0%E5%B3%B0"

let str = '珠峰';
let buf = new Buffer(str, 'utf8');
console.log(buf);

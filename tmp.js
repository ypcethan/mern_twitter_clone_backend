const moment = require("moment-timezone");
var taipei = moment.tz(Date.now(), "Asia/Taipei");

console.log(Date.now());
console.log(new Date());
console.log(taipei.format());
console.log(moment.tz(Date.now(), "Asia/Taipei").format().fromNow());

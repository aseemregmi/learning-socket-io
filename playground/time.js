const moment = require('moment');
const lll = new Date();
console.log(lll);
const date = new moment(lll);

console.log(date.format('h:mm a'));

var a = 'a';
var format = a.replace(/^[.*+?^${}()|[\]\\]/g, '\\$&');
let regex = /^[ก-๙a-zA-Z]/;
console.log(regex.test(a));
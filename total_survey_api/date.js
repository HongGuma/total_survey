const today = new Date();
var month = ("0" + (today.getMonth() + 1)).slice(-2);
var day = ("0" + today.getDate()).slice(-2);
var hour = ("0" + today.getHours()).slice(-2);
var min = ("0" + today.getMinutes()).slice(-2);
var sec = ("0" + today.getSeconds()).slice(-2);
const date = `${today.getFullYear()}` + month + day + hour + min + sec;

module.exports = date;

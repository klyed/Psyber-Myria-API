//===============================
// Custom API by @klye
// Untested / unimplemented shit marked with ***
//===============================
const log = require('fancy-log');
const fs = require('fs');

const debug = false;

let { Bronze, Silver, Gold } = require("./api/nft.js");

module.exports.bronze_nft = async(id) => {
  var d = await Bronze(id).then(d => {return d}).catch(e => log(e));
  log(d);
  return d;
};//END bronze_nft

module.exports.silver_nft = async(id) => {
  var d = await Silver(id).then(d => {return d}).catch(e => log(e));
  log(d);
  return d;
};//END silver_nft

module.exports.gold_nft = async(id) => {
  var d = await Gold(id).then(d => {return d}).catch(e => log(e));
  log(d);
  return d;
};//END gold_nft

const io = require("socket.io");
const socket = io();
const flog = require('fancy-log');
const { config } = require("./config/index.js");
const { bronze_nft, silver_nft, gold_nft } = require("./api.js");
const { urlparser } = require("./snippets/urlparser.js");


function log(m){
  if(!m) return;
  return flog(`APIROUTER.JS: ${m.toString()}`);
}

process.on('message', async function(m) {
  try {
    if(config.debug == true){
      log(m);
    }
  } catch(e) {
    log(`Message Error!`);
    log(e)
  }

  switch (m.type) {
    case 'request':
    var parsedURL = urlparser(m.req['url']);
    if(config.debug == true) log(parsedURL)
    log(`parsedURL:`)
    log(JSON.stringify(parsedURL));
    var urlRoute = Object.keys(parsedURL);
    if(urlRoute[0] == undefined) urlRoute[0] = 'default';
    log(`urlRoute: ${urlRoute[0]}`);

    switch(urlRoute[0]) {

      case 'bronze':
      var id = parsedURL['bronze'];
      log(`bronze id: ${id}`);
      var item = await bronze_nft(id);
      process.send(JSON.stringify({
        type: 'response',
        payload: item,
        resnum: m.resnum
      }));
      break;

      case 'silver':
      var id = parsedURL['silver'];
      log(`silver id: ${id}`);
      var item = await silver_nft(id);
      process.send(JSON.stringify({
        type: 'response',
        payload: item,
        resnum: m.resnum
      }));
      break;

      case 'gold':
      var id = parsedURL['gold'];
      log(`gold id: ${id}`);
      var item = await gold_nft(id);
      process.send(JSON.stringify({
        type: 'response',
        payload: item,
        resnum: m.resnum
      }));
      break;

    }//END switch (urlRoute);
    break;
  }//END switch (m.type);
});

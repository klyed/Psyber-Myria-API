var express = require("express"),
  app = express(),
  server = require("http").createServer(app),
  helmet = require('helmet'),
  io = require("socket.io")(server),
  session = require("express-session"),
  bodyParser = require('body-parser'),
  forker = require("child_process"),
  log = require('fancy-log');

const fs = require('fs');
const { config } = require("./config/index.js");
const { censor, simpleStringify, FixNull, ipParse, urlParse } = require('./snippets/tools.js');
const slowDown = require("express-slow-down");
const rateLimit = require('express-rate-limit');
var debug = config.debug;
const sec = config.sechash;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});//END limiter

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 250, // allow 100 requests per 15 minutes, then...
  delayMs: 100 // begin adding 500ms of delay per request above 100:
});//END speedLimiter

app.use(limiter);
app.use(speedLimiter);

const sessiondata = {
  secret: sec,
  saveUninitialized: false, // don't create session until something stored,
  resave: false, // don't save session if unmodified
  cookie:{maxAge:6000}
};//END sessiondata

var sessionMiddleware = session(sessiondata);
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//app.use(helmet({contentSecurityPolicy: false})),
io.use(function(socket, next) {sessionMiddleware(socket.request, socket.request.res, next)});

let clientIp;
let appSocketList = [];
let ipAddressList = [];

function httpRedirect(req, res, next){
  if(debug == true){
    log(`request:`);
    log(req)
    log(`response:`);
    log(res)
  }//END debug

  clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  clientIp = ipParse(clientIp);

  if (req.headers['x-forwarded-proto'] === 'http') {
    res.redirect(`http://127.0.0.1:${config.port}/api`);
  }else{
    next();
  };
}//END httpRedirect

log("API: Initializing Public API Routing...");
var apiHandler = forker.fork('./apirouter.js');

log(`API: Psyber-X Myria REST API v${config.version} Started on Port: ${config.port}`);
server.listen(config.port);

app.use("/", httpRedirect, express.static(__dirname + "/client"));

var resnum = 0;
var resarray = [];


app.get(["/api", "/api*"], (req, res) => {
  if(debug == true){
    console.log(`/API MESSAGE`)
    console.log(req)
  }//END if(debug == true)
  resarray.push(res);
  var requestData = {
      httpVersion: req.httpVersion,
      httpVersionMajor: req.httpVersionMajor,
      httpVersionMinor: req.httpVersionMinor,
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.body
  };
  apiHandler.send({type:'request', req: requestData, resnum: resnum});
  resnum++;
});//END app.get(["/api", "/api*"]

apiHandler.on('message', function(m) {
  console.log(`API: HANDLER`);
  log(m)
  try {
    m = JSON.parse(m);
    if(debug == true){
      log(`apiHandler.on('message'`)
      log(m);
    }
  } catch(e) {
    log(`API: Message Error`);
  }

  switch(m.type){
    case 'response':
      var response = resarray[m.resnum];
      response.json(m.payload);
      const index = resarray.indexOf(m.resnum);
        if (index > -1) {
          resarray.splice(index, 1);
        }
    break;
  }
});//END apiHandler.on('message'

var numClients = 0;

//socket.io Routes
io.on("connection", function(socket) {
  if(typeof appSocketList != undefined && !appSocketList.includes(socket)){
    appSocketList[socket];
    if(debug == true) log(`APP: appSocketList: ${appSocketList}`);
  }
  if(typeof clientIp != undefined && !ipAddressList.includes(clientIp)){
    ipAddressList[clientIp];
    log(`ipAddressList:`);
    log(ipAddressList);
    if(debug == true) log(`APP: ipAddressList: ${ipAddressList}`);
  }

  socket.on('disconnect', function() {
    if(typeof appSocketList != undefined && appSocketList.includes(socket)){
      delete appSocketList[socket];
      appSocketList = FixNull(appSocketList);
      if(debug == true) log(`APP: appSocketList: ${appSocketList}`);
    }
    if(typeof clientIp != undefined && ipAddressList.includes(clientIp)){
      delete ipAddressList[clientIp];
      ipAddressList = FixNull(ipAddressList);
      if(debug == true) log(`APP: ipAddressList: ${ipAddressList}`);
    }
  });
  socket.request.session['ipaddress'] = clientIp;
});

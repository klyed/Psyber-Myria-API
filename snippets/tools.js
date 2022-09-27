var crypto = require('crypto');
let Fibcache = {};

module.exports = {
  censor: (censor) => {
    var i = 0;
    return function(key, value) {
      if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value)
      return '[Circular]';
      if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';
      ++i; // so we know we aren't using the original object anymore
      return value;
    }
  },

  simpleStringify: (object) => {
    var simpleObject = {};
    for (var prop in object ){
      if (!object.hasOwnProperty(prop)){
        continue;
      }
      if (typeof(object[prop]) == 'object'){
        continue;
      }
      if (typeof(object[prop]) == 'function'){
        continue;
      }
      simpleObject[prop] = object[prop];
    }
    return [simpleObject]; // returns cleaned up JSON
  },

  FixNull: (a) => {
    if(debug == true){
      log(`APP: FixNull() PRE:`);
      log(a);
    }
    var wow = a.filter(function (el) {
      if(el != null) {
        return el;
      }
    });
    if(debug == true){
      log(`APP: FixNull() POST:`);
      log(wow);
    }
    return wow;
  },

  ipParse: (address) => {
    if(address) address = address.toString();
    var r = /\b\d{1,255}\.\d{1,255}\.\d{1,255}\.\d{1,255}\b/;
    var a = address;
    var t = a.match(r);
    return t;
  },

  urlParse: (URL) => {
    if(URL) URL = URL.toString();
    var r = /.*\.html$/;
    var a = URL;
    var t = a.match(r);
    return t;
  },

  // Function to check letters and numbers
  alphanumeric: (inputtxt) => {
    var letterNumber = /^[0-9a-zA-Z]+$/;
    if (inputtxt.match(letterNumber)) {
      return true;
    } else {
      return false;
    }
  },

  randomhash: () => {
    var random = crypto.randomBytes(64).toString('base64');
    return random;
  },

  fibonacci: (n) => {
    if (n <= 1) {
      return n;
    }
    if(Fibcache[n]) {
      return Fibcache[n];
    }
    const result = fibonacci(n - 1) + fibonacci(n - 2);
    Fibcache[n] = result;
    return result;
  },

  overFlowCheck: (a) => {
    if (Number.isSafeInteger(a)) {
      return true;
    } else {
      return false;
    }
  },

  parseFirstWord: (words) => {
      var n = words.split(" ");
      return n[n.length - 1];
  },

  secondsToHms: (d) => {
      d = Number(d);
      var h = Math.floor(d / 3600);
      var m = Math.floor(d % 3600 / 60);
      var s = Math.floor(d % 3600 % 60);

      var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
      var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
      var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
      return hDisplay + mDisplay + sDisplay;
  }
};//END module.exports

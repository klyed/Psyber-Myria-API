const dotenv = require('dotenv');
dotenv.config();

   const config = {
      version: process.env.VERSION,
      port: process.env.WEB_PORT,
      secret: process.env.SESSION_SECRET,
      api: process.env.API_ADDRESS,
      test_api: process.env.TEST_API_ADDRESS,
      debug: process.env.DEBUG,
      sechash: process.env.SECHASH
    };

exports.config = config;

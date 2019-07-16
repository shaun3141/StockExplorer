const https = require("https");
const Request = require("request");


const key = process.env.IEX_PUBLIC_TOKEN;

exports.getTicker = function(ticker) {
  return exports.makeRequest(`/stable/stock/${ticker}/quote`, key)
};

exports.makeRequest = function(endpoint) {
  return new Promise(function(resolve, reject) {

    const BASE_URL = 'https://cloud.iexapis.com';

    Request(`${BASE_URL}${endpoint}?token=${key}`, function (error, response, body) {
      if (error) {
        reject(error.error);
      }
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        console.log(body);
        reject(body);
      }
    });
    // try {
    //   let request = https.request({
    //     method: "GET",
    //     host: "cloud.iexapis.com",
    //     // path: `/stable/stock/TWLO/quote?token=pk_2049089fb7cc4883bacb89ba873bdcec`
    //     path: `${endpoint}?token=${key}`
    //   }, function(response) {
    //     let json = "";
    //     response.on('data', function (chunk) {
    //       json += chunk;
    //     });
    //     response.on('end', function() {
    //       resolve(JSON.parse(json));
    //     });
    //   });

    //   request.end();
    // } catch (e) {
    //   reject(e);
    // }

  });
};
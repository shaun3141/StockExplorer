const https = require("https");
const IntrinioSDK = require('intrinio-sdk');
IntrinioSDK.ApiClient.instance.authentications['ApiKeyAuth'].apiKey = process.env.INTRINIO_SANDBOX_KEY;

var securityAPI = new IntrinioSDK.SecurityApi();

exports.getRatings = async function(ticker, daysAgo) {
  // https://docs.intrinio.com/documentation/javascript/get_security_zacks_analyst_ratings_v2
  return new Promise(function(resolve, reject) {
    // const opts = { 
    //   'startDate': new Date("2018-01-01"), // Date | Return prices on or after the date
    //   'endDate': new Date("2019-01-01"), // Date | Return prices on or before the date
    //   'pageSize': 100, // Number | The number of results to return
    //   'nextPage': null // String | Gets the next page of data from a previous API call
    // };

    var opts = { 
      'startDate': null, // String | Limit ratings to those on or after this date
      'endDate': null, // String | Limit ratings to those on or before this date
      'meanGreater': null, // Number | Return only records with a mean (average) higher than this value
      'meanLess': null, // Number | Return only records with a mean (average) lower than this value
      'strongBuysGreater': null, // Number | Return only records with more than this many Strong Buy recommendations
      'strongBuysLess': null, // Number | Return only records with fewer than this many Strong Buy recommendations
      'buysGreater': null, // Number | Return only records with more than this many Buy recommendations
      'buysLess': null, // Number | Return only records with fewer than this many Buy recommendations
      'holdsGreater': null, // Number | Return only records with more than this many Hold recommendations
      'holdsLess': null, // Number | Return only records with fewer than this many Hold recommendations
      'sellsGreater': null, // Number | Return only records with more than this many Sell recommendations
      'sellsLess': null, // Number | Return only records with fewer than this many Sell recommendations
      'strongSellsGreater': null, // Number | Return only records with more than this many Strong Sell recommendations
      'strongSellsLess': null, // Number | Return only records with fewer than this many Strong Sell recommendations
      'totalGreater': null, // Number | Return only records with more than this many recommendations, regardless of type
      'totalLess': null, // Number | Return only records with fewer than this many recommendations, regardless of type
      'pageSize': 100 // Number | The number of results to return
    };

    securityAPI.getSecurityZacksAnalystRatings(ticker, opts).then(function(data) {
      console.log("here1");
      resolve(data);
    }, function(error) {
      reject(error);
    });
  });
}

exports.makeRequest = function(endpoint, key) {
  return new Promise(function(resolve, reject) {
    try {
      let request = https.request({
        method: "GET",
        host: "api-v2.intrinio.com",
        // path: `/companies/AAPL?api_key=OjdlZGY1OWUzNGRiMzlmMTA0MzE5MTQ1YmU5NGQxM2E1`
        path: `${endpoint}?api_key=${key}}`
      }, function(response) {
        let json = "";
        response.on('data', function (chunk) {
          json += chunk;
        });
        response.on('end', function() {
          resolve(JSON.parse(json));
        });
      });

      request.end();
    } catch (e) {
      reject(e);
    }
  });
};
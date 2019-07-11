const Intrinio = require("./models/intrinio.js");
const Analysis = require("./models/analysis.js");
const LineReader = require('line-reader');



(async () => {
  try {

    let availableTickers = [];

    LineReader.eachLine('./data/Tickers_NasdaqTech.csv', function(line) {  
      availableTickers.push(line);
    });

    let popper = setInterval(async function() {
      if (availableTickers.length == 0) {
        clearInterval(popper);
      } else {
        let ticker = availableTickers.pop();
        try {
          let ratings = await Intrinio.getRatings(ticker);
          console.log(ratings.security.ticker + " | " + ratings.analyst_ratings[0].strong_buys + " | " + Analysis.shouldBuy(ratings));
          console.log(ratings);
        } catch (e) {
          // console.log("Security " + ticker + " not found");
        }
      }
    }, 15); // tightest possible is 10

  } catch (e) {
    console.error(e);
  }
})();
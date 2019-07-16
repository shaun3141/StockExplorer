const Intrinio = require("./models/intrinio.js");
const IEX = require("./models/iex.js");
const Analysis = require("./models/analysis.js");
const LineReader = require('line-reader');
const fs = require('fs');

if (process.env.NODE_ENV !== 'production'){
  require('longjohn');
}

(async () => {
  try {

    // https://cloud.iexapis.com/stable/ref-data/iex/symbols?token=pk_2049089fb7cc4883bacb89ba873bdcec?format=csv

    const IEX_ENABLED = './data/Tickers_IEX_Enabled.csv';
    const NASDAQ_TECH = './data/Tickers_NasdaqTech.csv';

    const OUTPUT_FILE = `${__dirname}/output/analyst_recommedations.csv`;

    let availableTickers = fs.readFileSync(IEX_ENABLED, 'utf8').split('\n').map(ticker => ticker.trim());

    fs.writeFile(OUTPUT_FILE, '', function (err) {
      if (err) throw err;
    });

    console.log(`Reviewing ${availableTickers.length} securities\n`);

    let popper = setInterval(async function() {

      if (availableTickers.length == 0) {

        clearInterval(popper);

      } else {

        let ticker = availableTickers.pop();
        try {
          let ratings = await Intrinio.getRatings(ticker);
          if (Analysis.shouldBuy(ratings)) {
            try {
              let security = await IEX.getTicker(ticker);
              console.log(ratings.security.ticker.padEnd(6) + " | " + (ratings.analyst_ratings[0].mean + "").padStart(4) + " | " + (ratings.analyst_ratings[0].total + "").padStart(3) + " | " + (security.latestPrice + "").padStart(7));
              fs.appendFile(
                OUTPUT_FILE,
                `${ratings.security.ticker}, ${ratings.analyst_ratings[0].mean}, ${security.latestPrice}\n`, 
                function(err) {if (err) {console.error(err);}}
              );
            } catch(e) {
              console.log("IEX Exception");
              console.log(e.status);
            }
          }
        } catch (e) {
          if (e.status != 404) {
            console.log("Intrinio Exception");
            console.log(e.status + " | " + e.path);
          } else {
            // console.log("Security " + ticker + " not found");
          }
        }

      }
    }, 100); // tightest possible is 10

  } catch (e) {
    console.error(e);
  }
})();
const MINIMUM_MEAN = 1.5;
const MINIMUM_NUM_RATINGS = 8;

exports.shouldBuy = function(ratings) {
  if (
    ratings.analyst_ratings[0] && 
    ratings.analyst_ratings[0].mean <= MINIMUM_MEAN && 
    ratings.analyst_ratings[0].total >= MINIMUM_NUM_RATINGS
  ) {
    return true;
  } else {
    return false;
  }
}
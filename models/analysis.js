exports.shouldBuy = function(ratings) {
  if (ratings.analyst_ratings[0].mean < 1.5) {
    return true;
  } else {
    return false;
  }
}
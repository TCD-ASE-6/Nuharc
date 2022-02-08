module.exports.shuffle =  function shuffle(list) {
  let n = list.length;
  let random;

  while (n) {
    random = (Math.random() * n--) >>> 0; // unsigned integer
    [list[n], list[random]] = [list[random], list[n]];
  }

  return list;
}

module.exports.getRandomNumber = function(lower, upper) {
  if (lower === undefined && upper === undefined) {
    return 0;
  }

  if (upper === undefined) {
    upper = lower;
    lower = 0;
  }

  let temp;
  if (lower > upper) {
    temp = lower;
    lower = upper;
    upper = temp;
  }

  return Math.floor(lower + Math.random() * upper);
}
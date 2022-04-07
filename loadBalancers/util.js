/**
 * Helper Method for shuffling nodes
 * @param {*} list 
 * @returns 
 */
module.exports.shuffleList =  function shuffleList(list) {
  let len = list.length;
  let rdm;
  while (len) {
    rdm = (Math.random() * len--) >>> 0;
    [list[len], list[rdm]] = [list[rdm], list[len]];
  }
  return list;
}

module.exports.CONSTANTS = {
  SIGNAL_TERMINATE: "SIGTERM",
  SIGNAL_INTERNAL: "SIGINT"
}
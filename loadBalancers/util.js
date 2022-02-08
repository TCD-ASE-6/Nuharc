/**
 * Helper Method for shuffling nodes
 * @param {*} list 
 * @returns 
 */
module.exports.shuffleList =  function shuffleList(list) {
  let len = list.length;
  let rdm;
  while (len) {
    rdm = (Math.random() * len--) >>> 0; // unsigned integer
    [list[len], list[rdm]] = [list[rdm], list[n]];
  }
  return list;
}
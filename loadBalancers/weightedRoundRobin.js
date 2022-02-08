const BaseBalancer = require("./baseBalancer");

class WeightedRoundRobin extends BaseBalancer {
  currentIdx = 0;
  gcdWeight = 0;
  currWeight = 0;
  maxWeight = 0;

  reset(pool) {
    const nodeList = super.reset(pool);
    this.gcdWeight = this.getGCDWeight(...this.weightMap.values());
    this.currentIdx = -1;
    this.currWeight = 0;
    let maxWeight = 0;
    nodeList.forEach((host) => {
      const weight = this.getWeight(host);
      maxWeight = Math.max(maxWeight, weight);
    });
    this.maxWeight = maxWeight;
    return nodeList;
  }

/**
 * Method to get gcd weight of the list of host
 * Evaluates the greatest common divisor for the weights
 * @param  {...any} arr 
 * @returns 
 */
  getGCDWeight(...arr) {
    // Euclidean Algorithm
    const list = [].concat(...arr);
    const getGCD = (x, y) => {
      return !y ? x : this.getGCDWeight(y, x % y);
    };
    return list.reduce((a, b) => getGCD(a, b));
  }

  /**
   * Weighted Round Robin Algo Implementation
   * Returns the host based on current Index and current Weight
   * @returns Host 
   */
  pickHost() {
    this.currentIdx = (this.currentIdx + 1) % this.size;
    if (this.currentIdx == 0) {
      this.currWeight = this.currWeight - this.gcdWeight;

      if (this.currWeight <= 0) {
        this.currWeight = this.maxWeight;

        if (this.currWeight == 0) {
          return null;
        }
      }
    }
    const address = this.currentPool[this.currentIdx];
    if (this.getWeight(address) >= this.currWeight) {
      return {
        host: address,
      };
    }
  }

}

module.exports = WeightedRoundRobin;
const BaseBalancer = require("./baseBalancer");
const getRandomNumber = require("./util").getRandomNumber;

class WeightedRoundRobin extends BaseBalancer {
  currentIndex = 0;
  gcdWeight = 0;
  currentWeight = 0;
  maxWeight = 0;

  reset(pool) {
    const nodeList = super.reset(pool);
    this.currentIndex = -1;
    this.currentWeight = 0;
    this.gcdWeight = this.gcd(...this.weightMap.values());
    // console.log("gcdWeight",this.gcdWeight);
    let maxWeight = 0;

    nodeList.forEach((host) => {
      const weight = this.getWeight(host);
      maxWeight = Math.max(maxWeight, weight);
    });

    this.maxWeight = maxWeight;

    return nodeList;
  }

  gcd(...arr) {
    // Euclidean Algorithm
    const data = [].concat(...arr);

    const helperGcd = (x, y) => {
      return !y ? x : this.gcd(y, x % y);
    };

    return data.reduce((a, b) => helperGcd(a, b));
  }

  pick() {
    while (true) {
      this.currentIndex = (this.currentIndex + 1) % this.size;

      if (this.currentIndex == 0) {
        this.currentWeight = this.currentWeight - this.gcdWeight;

        if (this.currentWeight <= 0) {
          this.currentWeight = this.maxWeight;

          if (this.currentWeight == 0) return null;
        }
      }

      const address = this.currentPool[this.currentIndex];
      if (this.getWeight(address) >= this.currentWeight) {
        return {
          host: address,
        };
      }
    }
  }

  }

  module.exports = WeightedRoundRobin;
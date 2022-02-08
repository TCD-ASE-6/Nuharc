const shuffle = require("./util").shuffle;
const DEFAULT_WEIGHT = 100;
  
  class BaseBalancer {
    weightMap = {};
    defaultWeight;
    originalPool = [];
    currentPool = [];
    
    get size() {
    const len = this.currentPool.length;
    return len ? len : 0;
    }
  
    constructor(pool, options) {
      const { defaultWeight } = options || {};
  
      this.defaultWeight = defaultWeight || DEFAULT_WEIGHT;
      this.currentPool = [];
  
      this.reset(pool);
    }
  
    reset(originalPool) {
      if (!originalPool) {
          return null;
      }
  
      if (typeof originalPool !== "object" || originalPool.length < 1) {
        return null;
      }
  
      if (this.originalPool !== originalPool) {
        const prepareData = this.reOrganisePool(
          originalPool,
          this.defaultWeight
        );
  
        const newPool = prepareData.pool;
  
        this.originalPool = originalPool;
        this.currentPool = shuffle(newPool);
        this.weightMap = prepareData.weightMap;
      }
  
      return this.currentPool;
    }
  
    reOrganisePool(
      pool,
      defaultWeight
    ) {
      if (pool.length === 0) {
        throw new Error("cannot transform a zero length pool");
      }
  
      const nodeList = [];
      const weightMap = new Map();
  
      pool.forEach((node) => {
        let realWeight;
  
        if (typeof node === "object") {
          const { host, weight } = node;
  
          nodeList.push(host);
  
          realWeight = weight ? weight : defaultWeight;
          weightMap.set(host, realWeight);
        } else {
          nodeList.push(node);
  
          realWeight = defaultWeight;
          weightMap.set(node, realWeight);
        }
      });
  
      return {
        pool: nodeList,
        weightMap,
      };
    }
  
    getWeight(address) {
      return this.weightMap.get(address);
    }
  
    pick() {
      throw new Error("Algo logic for picking to be implemented in the base class");
    }

}

module.exports = BaseBalancer;
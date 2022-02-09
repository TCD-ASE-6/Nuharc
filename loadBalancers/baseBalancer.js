const shuffleList = require("./util").shuffleList;
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
      this.reset(pool);
    }
  
    /**
     * Reset Pool when connection ends or server restarts
     * @param {*} originalPool 
     * @returns 
     */
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
        this.weightMap = prepareData.weightMap;
        this.originalPool = originalPool;
        this.currentPool = shuffleList(newPool);
      }
      return this.currentPool;
    }
  
    /**
     * Re Organises the pool based on default weight
     * @param {*} pool 
     * @param {*} defaultWeight 
     * @returns 
     */
    reOrganisePool(
      pool,
      defaultWeight
    ) {
      if (pool.length === 0) {
        throw new Error("cannot evaluate a zero length pool");
      }
  
      const list = [];
      const weightMap = new Map();
  
      pool.forEach((node) => {
        let actualWeight;
        if (typeof node === "object") {
          const { host, weight } = node;
          list.push(host);
          actualWeight = weight ? weight : defaultWeight;
          weightMap.set(host, actualWeight);
        } else {
          list.push(node);
          actualWeight = defaultWeight;
          weightMap.set(node, actualWeight);
        }
      });
  
      return {
        pool: list,
        weightMap,
      };
    }
  
    getWeight(address) {
      return this.weightMap.get(address);
    }
  
    /**
     * Main method for the different algos logic
     * To be Implemented in the Child Class
     */
    pickHost() {
      throw new Error("Algo logic for picking to be implemented in the base class");
    }

}

module.exports = BaseBalancer;
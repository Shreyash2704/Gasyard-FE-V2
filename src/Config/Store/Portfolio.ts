import { makeAutoObservable } from "mobx";
import { PortfolioListReturnType, PortfolioObjectReturnType } from "../types";

class PortfolioStore {
    portfolio: PortfolioListReturnType = {};
  
    constructor() {
      makeAutoObservable(this);
    }
  
    // Action to update the portfolio
    setPortfolio(id: number, portfolioObject: PortfolioObjectReturnType) {
      this.portfolio[id] = portfolioObject;
    }
  
    // Action to remove a portfolio object
    removePortfolio(id: number) {
      delete this.portfolio[id];
    }

    clearPortfolio() {
      this.portfolio = {};
    }
  }
  
  export const portfolioStore = new PortfolioStore();
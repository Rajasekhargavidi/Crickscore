import { find, floor, isEmpty, round } from "lodash";
const CART_KEY = "cart";
const TOKEN_KEY = "jwt";

export const calculateOvers = balls => {
  let overs = floor(balls / 6);
  let localBalls = balls % 6;
  localBalls = localBalls === 0 ? "" : `.${localBalls}`;
  return `${overs}${localBalls}`;
};
export const calculateEco = (runs, balls) => {
  if (balls === undefined || runs === undefined || balls === 0 || runs === 0)
    return 0.0;
  return round((runs * 6) / balls, 2);
};

export const calculateSR = (runs, balls) => {
  if (balls === 0) return "NA";
  return round((runs * 100) / balls);
};

export const setCart = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const getCart = (cartKey = CART_KEY) => {
  if (localStorage && localStorage.getItem(cartKey)) {
    return JSON.parse(localStorage.getItem(cartKey));
  }
  return [];
};

export const clearCart = (cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.removeItem(cartKey);
  }
  return null;
};

export const setToken = (value, tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    localStorage.setItem(tokenKey, JSON.stringify(value));
  }
};

export const getToken = (tokenKey = TOKEN_KEY) => {
  if (localStorage && localStorage.getItem(tokenKey)) {
    return JSON.parse(localStorage.getItem(tokenKey));
  }
  return null;
};

export const clearToken = (tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    localStorage.removeItem(tokenKey);
  }
  return null;
};

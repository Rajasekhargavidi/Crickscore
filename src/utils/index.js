import { find, floor, isEmpty, round } from "lodash";
const CART_KEY = "cart";
const TOKEN_KEY = "jwt";

export const calculateOvers = balls => {
  return `${floor(balls / 6)}.${balls % 6}`;
};
export const calculateEco = (runs, balls) => {
  if (balls === 0) return 0.0;
  return round((runs * 6) / balls, 2);
};

export const setCart = (value, cartKey = CART_KEY) => {
  console.log(localStorage);
  if (localStorage) {
    console.log("local storage");
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

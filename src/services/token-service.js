import config from '../config';
import jwt_decode from 'jwt-decode';

const TokenService = {
  saveAuthToken(token) {
    window.localStorage.setItem(config.API_KEY, token);
  },
  getAuthToken() {
    return window.localStorage.getItem(config.API_KEY);
  },
  clearAuthToken() {
    window.localStorage.removeItem(config.API_KEY);
  },
  hasAuthToken() {
    return !!TokenService.getAuthToken();
  },
  getCollectionPath() {
    return jwt_decode(this.getAuthToken());
  },
};

export default TokenService;

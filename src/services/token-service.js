import config from '../config';
import jwtDecode from 'jwt-decode';

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
  parseJwt(jwt) {
    return jwtDecode(jwt);
  },
  parseAuthToken() {
    const authToken = TokenService.getAuthToken();
    if (authToken) return TokenService.parseJwt(authToken);
    else return undefined;
  },

};

export default TokenService;

export default {
    API_ENDPOINT: process.env.REACT_APP_SERVER_URL || 'http://localhost:8000/api',
    API_KEY: process.env.REACT_APP_API_KEY || 'gofish-jwt-token',
    SOCKET_PATH: process.env.REACT_APP_SOCKET_PATH || 'http://localhost:8000',
}

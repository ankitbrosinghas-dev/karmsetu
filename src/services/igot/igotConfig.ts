/// <reference types="vite/client" />
const isNode = typeof process !== 'undefined' && process.env != null;

export const igotConfig = {
  isDemoMode: true,
  baseUrl: 'https://igotkarmayogi.gov.in',
  apiBaseUrl: undefined,
  clientId: undefined,
  clientSecret: undefined,
  apiKey: undefined,
  redirectUri: undefined,
  
  validateConfig() {
    if (!this.isDemoMode) {
      if (!this.apiBaseUrl || !this.apiKey) {
        return false;
      }
    }
    return true;
  }
};

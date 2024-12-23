// stores/auth.ts

import { defineStore } from 'pinia';
import { useRuntimeConfig } from '#imports';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    token: null as null | any,
    user: null as null | any,
  }),
  actions: {
    setToken(token: any) {
      this.isAuthenticated = true;
      this.token = token;
    },
    setUser(user: any) {
      this.isAuthenticated = true;
      this.user = user;
    },
    clearAuth() {
      this.isAuthenticated = false;
      this.token = null;
      this.user = null;
    },
    async refreshToken() {
      const config = useRuntimeConfig();
      try {
        const response = await fetch(`${config.public.NUXT_OIDC_ISSUER}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: config.public.NUXT_OIDC_CLIENT_ID.toString(),
            client_secret: config.public.NUXT_OIDC_CLIENT_SECRET.toString(),
            refresh_token: this.token.refresh_token,
          }),
        });

        if (response.ok) {
          console.log("all ok")
          this.clearAuth();
          window.location.href = '/';
        } else {
          this.clearAuth();
          window.location.href = '/';
        }
      } catch (error) {
        console.error('Error refreshing token:', error);
        this.clearAuth();
      }
    },
  },
});